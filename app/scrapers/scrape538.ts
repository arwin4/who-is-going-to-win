import {
  DemPercentage,
  Outcome,
  RepPercentage,
  ScrapingFunction,
} from '~/types';
import { getPercentageFromString } from '~/utils/scrapers/getPercentageFromString';
import loadHtmlForScraping from '~/utils/scrapers/loadHtmlForScraping';

const scrape538: ScrapingFunction = async () => {
  try {
    const url = 'https://projects.fivethirtyeight.com/2024-election-forecast/';
    const loadedDocument = await loadHtmlForScraping(url);

    const repPredictionNode = loadedDocument('.rep.text-primary');
    const demPredictionNode = loadedDocument('.dem.text-primary');

    // Extract the complete text content of the element
    const repPredictionString = repPredictionNode.text();
    const demPredictionString = demPredictionNode.text();

    const repPercentage: RepPercentage =
      getPercentageFromString(repPredictionString);
    const demPercentage: DemPercentage =
      getPercentageFromString(demPredictionString);

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
      repPercentage,
      demPercentage,
    };
  } catch (err) {
    console.error('Unable to determine 538 prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrape538;
