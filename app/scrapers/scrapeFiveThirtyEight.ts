import axios from 'axios';
import * as cheerio from 'cheerio';
import determineResult from './utils/determineResult';

export default async function scrapeFiveThirtyEight() {
  const response = await axios.get(
    'https://projects.fivethirtyeight.com/2024-election-forecast/',
  );
  const html = response.data;
  const $ = cheerio.load(html);
  const targetElement = $('.rep.text-primary');

  // Extract the complete text content of the element
  const fullPredictionString = targetElement.text();

  if (!fullPredictionString) {
    throw new Error('Could not find the prediction');
  }

  return determineResult(fullPredictionString);
}
