import { Outcome, Prediction } from '~/types';

export default async function getPolymarket(): Promise<Prediction> {
  try {
    const url =
      'https://gamma-api.polymarket.com/markets?slug=will-donald-trump-win-the-2024-us-presidential-election&limit=1';

    const res = await fetch(url);
    const data = await res.json();
    const outcomePrices = data[0].outcomePrices;
    console.log(outcomePrices);

    const chanceStr = outcomePrices.match(/"([^"]*)"/)?.at(1);
    if (!chanceStr) throw new Error();

    const repDecimalChance = Number(outcomePrices.match(/"([^"]*)"/)[1]); // 0.538
    const repPercentage = Math.round(repDecimalChance * 100); // 54

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
    console.error('Unable to determine Polymarket rate');
    return {
      outcome: 'unknown',
      percentage: NaN,
    };
  }
}
