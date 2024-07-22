import { Prediction, Outcome } from './types';
import { getPercentageFromString } from './utils/getPercentageFromString';
import loadHtmlForScraping from './utils/loadHtmlForScraping';

export default async function scrapeFiveThirtyEight(): Promise<Prediction> {
  try {
    const url = 'https://projects.fivethirtyeight.com/2024-election-forecast/';
    const loadedDocument = await loadHtmlForScraping(url);

    // Node is targeted by party in class name (republican)
    const repPredictionNode = loadedDocument('.rep.text-primary');

    // Extract the complete text content of the element
    const repPredictionString = repPredictionNode.text();

    const repPercentage = getPercentageFromString(repPredictionString);

    let outcome: Outcome;

    if (repPercentage === 50) {
      outcome = 'tie';
    } else if (repPercentage > 50) {
      outcome = 'republican';
    } else if (repPercentage < 50) {
      outcome = 'democrat';
    } else {
      throw new Error();
    }

    return {
      outcome,
      percentage: repPercentage,
    };
  } catch (err) {
    console.error('Unable to determine 538 prediction');
    return {
      outcome: 'unknown',
      percentage: NaN,
    };
  }
}
