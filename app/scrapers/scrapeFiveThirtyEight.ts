import determineResult from './utils/determineResult';
import loadHtmlForScraping from './utils/loadHtmlForScraping';

export default async function scrapeFiveThirtyEight() {
  const url = 'https://projects.fivethirtyeight.com/2024-election-forecast/';
  const loadedDocument = await loadHtmlForScraping(url);

  const targetElement = loadedDocument('.rep.text-primary');

  // Extract the complete text content of the element
  const fullPredictionString = targetElement.text();

  if (!fullPredictionString) {
    console.error('Could not find the 538 prediction');
  }

  return determineResult(fullPredictionString);
}
