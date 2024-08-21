import { DemPercentage, RepPercentage, Outcome, Prediction } from './../types';
import puppeteer from 'puppeteer';
import { getPercentageFromString } from './utils/getPercentageFromString';

// TODO: Update scraper after paywall change. Graph is no longer available.

/**
 * Puppeteer is used because the winner percentage is contained within a graph
 * that uses JS. (Therefore, we can't just parse the HTML.)
 */
export default async function scrapeTheEconomist(): Promise<Prediction> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(
      'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
    );

    /**
     *  NOTE: at the time of implementation, this selector contains the winner. It's
     *  unknown whether it will still contain the winner if the prediction were to
     *  flip.
     */
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
      // Temporarily hardcode tie
      outcome: 'tie',
      repPercentage,
      demPercentage,
    };
  } catch (err) {
    console.error('Unable to determine Economist prediction');
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
}
