import { getPercentageFromString } from './getPercentageFromString';

export default function determineResult(fullPredictionString: string) {
  let outcome: 'democrat' | 'republican' | 'tie' | 'unknown';

  let percentage = getPercentageFromString(fullPredictionString);
  if (Number.isNaN(percentage)) {
    console.error('Could not find percentage in string');
    return {
      outcome: 'unknown',
      percentage: 0,
    };
  }

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
  } else if (
    fullPredictionString.includes('Biden') ||
    (fullPredictionString.includes('D') &&
      fullPredictionString.includes('in 100'))
  ) {
    outcome = 'democrat';
  } else {
    outcome = 'unknown';
  }

  // If the percentage of the loser was extracted, invert the outcome and
  // percentage.
  if (percentage < 50 || outcome !== 'unknown') {
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
