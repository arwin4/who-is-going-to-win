import {
  DemPercentage,
  RepPercentage,
  Outcome,
  ScrapingFunction,
} from '../types';
import { chromium as playwright } from 'playwright-core';
import chromium from '@sparticuz/chromium';
import { getPercentageFromString } from '../utils/scrapers/getPercentageFromString';

async function getPartyPredictionStrings() {
  console.log('Preparing to launch playwright browser');

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
  );
  await page.locator('.top-forecast-table').isVisible();
  const fullPredictionString = await page
    .locator('.top-forecast-table')
    .allInnerTexts();

  const splitPredictionStrings = fullPredictionString[0].split('\n');
  const repPredictionString = splitPredictionStrings.find((string) =>
    string.includes('Trump'),
  );
  const demPredictionString = splitPredictionStrings.find((string) =>
    string.includes('Harris'),
  );
  if (!repPredictionString) throw new Error('Unable to find rep prediction');
  if (!demPredictionString) throw new Error('Unable to find dem prediction');

  // We don't close the browser on Vercel, since this is slow and not necessary
  // await browser.close();

  return { repPredictionString, demPredictionString };
}

/**
 * Playwright is used because the winner percentage is contained within a graph
 * that uses JS. (Therefore, we can't just parse the HTML.)
 */
const scrapeEconomist: ScrapingFunction = async () => {
  try {
    const { repPredictionString, demPredictionString } =
      await getPartyPredictionStrings();

    if (!repPredictionString || !demPredictionString) throw new Error();

    let outcome: Outcome;

    const repPercentage: RepPercentage =
      getPercentageFromString(repPredictionString);
    const demPercentage: DemPercentage =
      getPercentageFromString(demPredictionString);

    if (repPercentage === demPercentage) {
      outcome = 'tie';
    } else if (repPercentage > demPercentage) {
      outcome = 'republican';
    } else if (repPercentage < demPercentage) {
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
    console.error('Unable to determine Economist prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeEconomist;
