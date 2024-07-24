import { Outcome, Prediction } from '../types';
import { getPercentageFromString } from './utils/getPercentageFromString';
import loadHtmlForScraping from './utils/loadHtmlForScraping';

export default async function scrapeTheHill(): Promise<Prediction> {
  try {
    const url = 'https://elections2024.thehill.com/forecast/2024/president/';
    const loadedDocument = await loadHtmlForScraping(url);

    // Node is targeted by text
    const predictionNode = loadedDocument(
      'p:contains("Our model currently predicts that")',
    );

    // Extract the complete text content of the element
    const fullPredictionString = predictionNode.text();

    // String will contain percentage of the winner
    const winnerPercentage = getPercentageFromString(fullPredictionString);

    let outcome: Outcome;
    if (winnerPercentage === 50) {
      outcome = 'tie';
    } else if (Number.isNaN(winnerPercentage)) {
      throw new Error();
    } else if (fullPredictionString.includes('Trump')) {
      outcome = 'republican';
    } else {
      outcome = 'democrat';
    }

    return {
      outcome,
      percentage: winnerPercentage,
    };
  } catch (err) {
    console.error('Unable to determine The Hill prediction');
    return {
      outcome: 'unknown',
      percentage: NaN,
    };
  }
}
