import puppeteer from 'puppeteer';
import determineResult from './utils/determineResult';

export default async function scrapeTheEconomist() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
  );

  /**
  *   NOTE: at the time of implementation, this selector contains the winner.
      It's unknown whether it will still contain the winner if the prediction
      were to flip. 
  */
  await page.waitForSelector('.svelte-h0zoai');

  // Extract text from <tspan> elements containing "in 100"
  const tspanTexts = await page.evaluate(() => {
    const tspans = document.querySelectorAll('tspan');
    return Array.from(tspans)
      .filter(
        (tspan) =>
          tspan.textContent.includes('in 100') &&
          tspan.textContent.length === 11,
      )
      .map((tspan) => tspan.textContent);
  });
  await browser.close();

  const fullPredictionString = tspanTexts[3];

  return determineResult(fullPredictionString);
}
