import axios from 'axios';
import * as cheerio from 'cheerio';
import determineResult from './utils/determineResult';

export default async function scrapeTheHill() {
  const response = await axios.get(
    'https://elections2024.thehill.com/forecast/2024/president/',
  );
  const html = response.data;

  const $ = cheerio.load(html);

  const targetElement = $('p:contains("Our model currently predicts that")');

  // Extract the complete text content of the element
  const fullPredictionString = targetElement.text();

  if (!fullPredictionString) {
    throw new Error('Could not find the prediction');
  }

  return determineResult(fullPredictionString);
}
