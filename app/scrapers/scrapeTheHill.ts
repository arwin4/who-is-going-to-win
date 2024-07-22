import determineResult from './utils/determineResult';
import loadHtmlForScraping from './utils/loadHtmlForScraping';

export default async function scrapeTheHill() {
  const url = 'https://elections2024.thehill.com/forecast/2024/president/';
  const loadedDocument = await loadHtmlForScraping(url);

  const targetElement = loadedDocument(
    'p:contains("Our model currently predicts that")',
  );

  // Extract the complete text content of the element
  const fullPredictionString = targetElement.text();

  if (!fullPredictionString) {
    console.error('Could not find the The Hill prediction');
  }

  return determineResult(fullPredictionString);
}
