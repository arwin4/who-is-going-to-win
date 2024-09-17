import {
  DemPercentage,
  RepPercentage,
  Outcome,
  ScrapingFunction,
} from './../types';
import { chromium as playwright } from 'playwright-core';
import chromium from '@sparticuz/chromium';
import { getPercentageFromString } from '../utils/scrapers/getPercentageFromString';

async function getPredictions() {
  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto('https://e.infogram.com/_/uUj4nsuHaHwvUtNxME7K?src=embed');

  const demPredictionLocator = page.getByLabel(/(Kamala Harris:.*Chance)/);
  const repPredictionLocator = page.getByLabel(/(Donald Trump:.*Chance)/);

  const demPredictionString =
    await demPredictionLocator.getAttribute('aria-label');
  const repPredictionString =
    await repPredictionLocator.getAttribute('aria-label');

  // We don't close the browser on Vercel, since this is slow and not necessary
  // await browser.close();

  return { demPredictionString, repPredictionString };
}

/**
 * Playwright is used because the winner percentage is contained within a graph
 * that uses JS. (Therefore, we can't just parse the HTML.)
 */
const scrapeRaceToTheWH: ScrapingFunction = async () => {
  try {
    const fullPredictionsStrings = await getPredictions();

    if (!fullPredictionsStrings.demPredictionString) throw new Error();
    if (!fullPredictionsStrings.repPredictionString) throw new Error();

    let outcome: Outcome;

    const repPercentage: RepPercentage = getPercentageFromString(
      fullPredictionsStrings.repPredictionString,
    );
    const demPercentage: DemPercentage = getPercentageFromString(
      fullPredictionsStrings.demPredictionString,
    );

    if (repPercentage === 50) {
      outcome = 'tie';
    } else if (repPercentage > 50) {
      outcome = 'republican';
    } else if (repPercentage < 50) {
      outcome = 'democrat';
    } else {
      throw new Error();
    }

    return {
      outcome,
      repPercentage,
      demPercentage,
    };
  } catch (err) {
    console.error('Unable to determine RaceToTheWH prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeRaceToTheWH;
