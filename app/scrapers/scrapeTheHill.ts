import {
  DemPercentage,
  Outcome,
  RepPercentage,
  ScrapingFunction,
} from '../types';
import { getPercentageFromString } from '../utils/scrapers/getPercentageFromString';
import loadHtmlForScraping from '../utils/scrapers/loadHtmlForScraping';

const scrapeTheHill: ScrapingFunction = async () => {
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
    let demPercentage: DemPercentage;
    let repPercentage: RepPercentage;

    if (winnerPercentage === 50) {
      outcome = 'tie';
      repPercentage = 50;
      demPercentage = 50;
    } else if (Number.isNaN(winnerPercentage)) {
      throw new Error();
    } else if (fullPredictionString.includes('Trump')) {
      outcome = 'republican';
      repPercentage = winnerPercentage;
      demPercentage = 100 - winnerPercentage;
    } else {
      outcome = 'democrat';
      demPercentage = winnerPercentage;
      repPercentage = 100 - winnerPercentage;
    }

    return {
      outcome,
      repPercentage,
      demPercentage,
    };
  } catch (err) {
    console.error('Unable to determine The Hill prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeTheHill;
