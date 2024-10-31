import {
  DemPercentage,
  ocrResponse,
  Outcome,
  RepPercentage,
  ScrapingFunction,
} from '~/types';
import { getPercentageFromString } from '~/utils/scrapers/getPercentageFromString';
import loadHtmlForScraping from '~/utils/scrapers/loadHtmlForScraping';

async function getOCR(url: string): Promise<ocrResponse | null> {
  try {
    console.log('[Split Ticket] Fetching image');
    const imageRes = await fetch(url);
    const image = await imageRes.blob();
    const formData = new FormData();
    formData.append('image', image);

    console.log('[Split Ticket] Requesting OCR...');
    const res = await fetch('https://api.api-ninjas.com/v1/imagetotext', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY as string,
      },
      body: formData,
    });

    if (!res.ok) throw new Error();
    return res.json();
  } catch (error) {
    console.error('[Split Ticket] Unable to get OCR:');
    console.error(error);
    return null;
  }
}

/**
 * Base the outcome on the number of times a candidate's name is mentioned,
 * based on the assumption that the leading candidate's name occurs twice.
 */
function getOutcome(
  fullPrediction: ocrResponse,
  winnerPercentage: number,
): Outcome {
  const demCount = fullPrediction.reduce((acc, currentValue) => {
    if (currentValue.text.includes('Harris')) acc += 1;
    return acc;
  }, 0);

  const repCount = fullPrediction.reduce((acc, currentValue) => {
    if (currentValue.text.includes('Trump')) acc += 1;
    return acc;
  }, 0);

  if (demCount > repCount) {
    return 'democrat';
  } else if (repCount > demCount) {
    return 'republican';
  } else if (repCount === demCount && winnerPercentage === 50) {
    return 'tie';
  } else return 'unknown';
}

const scrapeSplitTicket: ScrapingFunction = async () => {
  try {
    console.log('[Split Ticket] Loading html...');
    const url = 'https://split-ticket.org/2024-presidential-ratings/';
    const loadedDocument = await loadHtmlForScraping(url);

    const predictionImg = loadedDocument('.attachment-post-thumbnail');
    const imageUrl = predictionImg.eq(0).attr('src');
    if (!imageUrl) throw new Error();

    const predictionOCR = await getOCR(imageUrl);
    if (!predictionOCR) throw new Error('[Split Ticket] Unable to get OCR.');
    console.log('[Split Ticket] Got OCR.');

    const percentageString = predictionOCR.find((ocr) =>
      ocr.text.includes('%'),
    );
    if (!percentageString) throw new Error();

    const leadPercentage = getPercentageFromString(percentageString.text);

    const outcome = getOutcome(predictionOCR, leadPercentage);
    const repPercentage: RepPercentage =
      outcome === 'republican' ? leadPercentage : 100 - leadPercentage;
    const demPercentage: DemPercentage =
      outcome === 'democrat' ? leadPercentage : 100 - leadPercentage;

    return {
      outcome,
      repPercentage,
      demPercentage,
    };
  } catch (err) {
    console.error('Unable to determine Split Ticket prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeSplitTicket;

// Example API response:
// const fullPrediction = [
//   {
//     text: 'Safe',
//     bounding_box: { x1: 306, y1: 1277, x2: 441, y2: 1325 },
//   },
//   { text: 'D', bounding_box: { x1: 464, y1: 1279, x2: 505, y2: 1324 } },
//   {
//     text: 'Safe',
//     bounding_box: { x1: 2081, y1: 1277, x2: 2214, y2: 1325 },
//   },
//   {
//     text: 'R',
//     bounding_box: { x1: 2238, y1: 1278, x2: 2277, y2: 1324 },
//   },
//   {
//     text: 'President',
//     bounding_box: { x1: 1032, y1: 1489, x2: 1564, y2: 1577 },
//   },
//   {
//     text: 'Trump',
//     bounding_box: { x1: 1032, y1: 1489, x2: 1564, y2: 1577 },
//   },
//   {
//     text: '53%',
//     bounding_box: { x1: 1377, y1: 1637, x2: 1555, y2: 1706 },
//   },
//   {
//     text: '226',
//     bounding_box: { x1: 543, y1: 1797, x2: 685, y2: 1866 },
//   },
//   {
//     text: 'Harris,',
//     bounding_box: { x1: 717, y1: 1797, x2: 1025, y2: 1883 },
//   },
//   {
//     text: '230',
//     bounding_box: { x1: 1057, y1: 1797, x2: 1198, y2: 1866 },
//   },
//   {
//     text: 'Trump,',
//     bounding_box: { x1: 1227, y1: 1794, x2: 1556, y2: 1889 },
//   },
//   {
//     text: '82',
//     bounding_box: { x1: 1590, y1: 1797, x2: 1682, y2: 1866 },
//   },
//   {
//     text: 'Toss',
//     bounding_box: { x1: 1710, y1: 1794, x2: 1909, y2: 1866 },
//   },
//   {
//     text: 'Up',
//     bounding_box: { x1: 1940, y1: 1797, x2: 2072, y2: 1889 },
//   },
// ];
