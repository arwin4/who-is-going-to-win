import { getPercentageFromString } from './getPercentageFromString';

export default function determineResult(fullPredictionString: string) {
  let percentage = getPercentageFromString(fullPredictionString);

  // Determine outcome
  let outcome: 'democrat' | 'republican' | 'tie';

  console.log(percentage);
  console.log(fullPredictionString);

  if (percentage === 50) {
    outcome = 'tie';
  } else if (
    fullPredictionString.includes('Trump') &&
    fullPredictionString.includes('Biden')
  ) {
    outcome = 'tie';
  } else if (
    fullPredictionString.includes('Trump') ||
    (fullPredictionString.includes('R') &&
      fullPredictionString.includes('in 100'))
  ) {
    outcome = 'republican';
  } else {
    outcome = 'democrat';
  }

  // If the percentage of the loser was extracted, reverse the outcome and percentage.
  if (percentage < 50) {
    percentage = 100 - percentage;
    if (outcome === 'republican') {
      outcome = 'democrat';
    } else if (outcome === 'democrat') {
      outcome = 'republican';
    }
  }

  return {
    outcome: outcome,
    percentage: percentage,
  };
}
