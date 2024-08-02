import { Outcome, Prediction, WinnerPercentage } from '~/types';

export default async function getPolymarket(): Promise<Prediction> {
  try {
    const trumpUrl =
      'https://gamma-api.polymarket.com/markets?slug=will-donald-trump-win-the-2024-us-presidential-election&limit=1';
    const harrisUrl =
      'https://gamma-api.polymarket.com/markets?slug=will-kamala-harris-win-the-2024-us-presidential-election&limit=1';

    const trumpRes = await fetch(trumpUrl);
    const trumpData = await trumpRes.json();

    const harrisRes = await fetch(harrisUrl);
    const harrisData = await harrisRes.json();

    const trumpOutcomePrices = trumpData[0].outcomePrices;
    const harrisOutcomePrices = harrisData[0].outcomePrices;

    const trumpChanceStr = trumpOutcomePrices.match(/"([^"]*)"/)?.at(1);
    if (!trumpChanceStr) throw new Error();

    const harrisChangeStr = harrisOutcomePrices.match(/"([^"]*)"/)?.at(1);
    if (!harrisChangeStr) throw new Error();

    const trumpDecimalChance = Number(trumpOutcomePrices.match(/"([^"]*)"/)[1]); // 0.538
    const trumpPercentage = Math.round(trumpDecimalChance * 100); // 54

    const harrisDecimalChance = Number(
      harrisOutcomePrices.match(/"([^"]*)"/)[1],
    );
    const harrisPercentage = Math.round(harrisDecimalChance * 100);

    let outcome: Outcome;
    let winnerPercentage: WinnerPercentage;

    if (trumpPercentage === 50) {
      outcome = 'tie';
      winnerPercentage = 50;
    } else if (trumpPercentage > 50) {
      outcome = 'republican';
      winnerPercentage = trumpPercentage;
    } else if (trumpPercentage < 50) {
      outcome = 'democrat';
      winnerPercentage = harrisPercentage;
    } else {
      throw new Error();
    }

    return {
      outcome,
      percentage: winnerPercentage,
    };
  } catch (err) {
    console.error('Unable to determine Polymarket rate');
    return {
      outcome: 'unknown',
      percentage: NaN,
    };
  }
}
