import { Prediction, Outcome } from './types';
import { getPercentageFromString } from './utils/getPercentageFromString';
import loadHtmlForScraping from './utils/loadHtmlForScraping';

export default async function scrapeFiveThirtyEight(): Promise<Prediction> {
  const url = 'https://projects.fivethirtyeight.com/2024-election-forecast/';
  const loadedDocument = await loadHtmlForScraping(url);

  const repPredictionNode = loadedDocument('.rep.text-primary');

  // Extract the complete text content of the element
  const repPredictionString = repPredictionNode.text();

  if (!repPredictionString) {
    console.error('Could not find the 538 prediction');
  }

  const repPercentage = getPercentageFromString(repPredictionString);

  let outcome: Outcome;
  if (repPercentage === 50) {
    outcome = 'tie';
  } else if (repPercentage > 50) {
    outcome = 'republican';
  } else if (repPercentage < 50) {
    outcome = 'democrat';
  } else {
    outcome = 'unknown';
  }

  return {
    outcome,
    percentage: repPercentage,
  };
}
