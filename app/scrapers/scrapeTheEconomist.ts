import { DemPercentage, RepPercentage, Outcome, Prediction } from './../types';
import puppeteer from 'puppeteer';
import { getPercentageFromString } from './utils/getPercentageFromString';

async function getFullPredictionString() {
  const username = process.env.ECONOMIST_USERNAME as string;
  const password = process.env.ECONOMIST_PASSWORD as string;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
  );

  await page.waitForSelector('div ::-p-text(Log in)');

  await Promise.all([
    page.waitForNavigation(),
    page.click('div ::-p-text(Log in)'),
  ]);

  await page.waitForSelector('#input-6');
  await page.focus('#input-6');
  await page.keyboard.type(username);
  await page.focus('#input-8');
  await page.keyboard.type(password);
  await page.keyboard.press('Enter');

  await page.waitForSelector('.svelte-h0zoai');

  const fullPredictionString = await page.evaluate(() => {
    const tspans = document.querySelectorAll('tspan');
    return Array.from(tspans).find(
      (tspan) =>
        tspan.textContent?.includes('in 100') &&
        tspan.textContent.length === 11,
    )?.textContent;
  });
  await browser.close();

  return fullPredictionString;
}

/**
 * Puppeteer is used because the winner percentage is contained within a graph
 * that uses JS. (Therefore, we can't just parse the HTML.)
 */
export default async function scrapeTheEconomist(): Promise<Prediction> {
  try {
    const fullPredictionString = await getFullPredictionString();

    console.log('prediction:', fullPredictionString);

    if (!fullPredictionString) throw new Error();

    let outcome: Outcome;

    const parsedPercentage = getPercentageFromString(fullPredictionString);
    if (parsedPercentage === 50) {
      outcome = 'tie';
      return {
        outcome,
        repPercentage: 50,
        demPercentage: 50,
      };
    }

    // The string may concern the Dem or the Rep, so determine whose it is
    let candidate: 'democrat' | 'republican';
    const firstLetterOfPredictionString = fullPredictionString.charAt(0);
    if (firstLetterOfPredictionString === 'D') {
      candidate = 'democrat';
    } else if (firstLetterOfPredictionString === 'R') {
      candidate = 'republican';
    } else {
      throw new Error();
    }

    let demPercentage: DemPercentage;
    let repPercentage: RepPercentage;

    if (parsedPercentage < 50) {
      if (candidate === 'democrat') {
        // D 40
        outcome = 'republican';
        repPercentage = 100 - parsedPercentage;
        demPercentage = parsedPercentage;
      } else {
        // R 40
        outcome = 'democrat';
        demPercentage = 100 - parsedPercentage;
        repPercentage = parsedPercentage;
      }
    } else {
      if (candidate === 'democrat') {
        // D 60
        outcome = 'democrat';
        demPercentage = parsedPercentage;
        repPercentage = 100 - parsedPercentage;
      } else {
        // R 60
        outcome = 'republican';
        repPercentage = parsedPercentage;
        demPercentage = 100 - parsedPercentage;
      }
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
}
