// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import determineResult from './utils/determineResult';
import puppeteer from 'puppeteer';
import determineResult from './utils/determineResult';

export default async function scrapeTheEconomist() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
  );

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

  console.log(tspanTexts);
  const fullPredictionString = tspanTexts[3];
  console.log(fullPredictionString);

  return determineResult(fullPredictionString);
}
