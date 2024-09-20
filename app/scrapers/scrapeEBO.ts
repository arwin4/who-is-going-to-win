import {
  DemPercentage,
  Outcome,
  RepPercentage,
  ScrapingFunction,
} from '~/types';
import { getPercentageFromString } from '~/utils/scrapers/getPercentageFromString';
import loadHtmlForScraping from '~/utils/scrapers/loadHtmlForScraping';

const scrapeEBO: ScrapingFunction = async () => {
  try {
    const url = 'https://electionbettingodds.com/';
    const loadedDocument = await loadHtmlForScraping(url);

    const demPercentageNode = loadedDocument('a:contains("Harris")')
      .closest('td')
      .next('td');
    const demPredictionString = demPercentageNode.find('p').text();

    const repPercentageNode = loadedDocument('a:contains("Trump")')
      .closest('td')
      .next('td');
    const repPredictionString = repPercentageNode.find('p').text();

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
    console.error('Unable to determine EBO prediction');
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeEBO;
