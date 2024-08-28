import { DemPercentage, RepPercentage, Outcome, Prediction } from './../types';
import playwright from 'playwright';
import { getPercentageFromString } from './utils/getPercentageFromString';

async function getFullPredictionString() {
  const username = process.env.ECONOMIST_USERNAME as string;
  const password = process.env.ECONOMIST_PASSWORD as string;

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
  );

  // await page.waitForSelector('div ::-p-text(Log in)');

  const logInBtn = page
    .locator('[data-test-id="Masthead"]')
    .getByRole('link', { name: 'Log in' });

  await logInBtn.click();
  // await page.waitForURL('https://myaccount.economist.com/s/login/**');

  await page.locator('#input-6').fill(username);
  await page.locator('#input-8').fill(password);
  await page.locator('#input-8').press('Enter');

  await page.locator('.svelte-h0zoai').isVisible();

  const fullPredictionString = await page
    .locator('tspan')
    .filter({ hasText: 'in 100' })
    .filter({ hasText: /^.{11}$/ }) // Assume chance% has two characters
    .first()
    .textContent();

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
