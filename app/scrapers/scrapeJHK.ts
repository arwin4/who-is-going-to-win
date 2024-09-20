import {
  DemPercentage,
  RepPercentage,
  Outcome,
  ScrapingFunction,
} from './../types';

import { parse } from 'csv-parse';

type Predictions = {
  demPercentage: DemPercentage;
  repPercentage: RepPercentage;
};

async function getPredictions(): Promise<Predictions> {
  const res = await fetch(
    'https://data.jhkforecasts.com/2024-president/standard/us-projected.csv',
  );
  const csv = await res.text();

  const csvPerLine: { record: string }[] = [];

  return new Promise((resolve, reject) => {
    parse(
      csv,
      {
        info: true,
        on_record: (record) => csvPerLine.push(record),
      },
      () => {
        try {
          const demPredictionString = csvPerLine.at(-1)?.record[6];
          const repPredictionString = csvPerLine.at(-2)?.record[6];

          if (!demPredictionString || !repPredictionString) throw new Error();

          const demPercentage: DemPercentage = Math.round(
            parseFloat(demPredictionString) * 100,
          );
          const repPercentage: RepPercentage = Math.round(
            parseFloat(repPredictionString) * 100,
          );

          resolve({ demPercentage, repPercentage });
        } catch (error) {
          reject();
        }
      },
    );
  });
}

const scrapeJHK: ScrapingFunction = async () => {
  try {
    const { demPercentage, repPercentage } = await getPredictions();

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
    console.error('Unable to determine JHK prediction');
    console.error(err);
    return {
      outcome: 'unknown',
      repPercentage: NaN,
      demPercentage: NaN,
    };
  }
};

export default scrapeJHK;
