import { getPercentageFromString } from './getPercentageFromString';

export default function determineResult(fullPredictionString: string) {
  let outcome: 'democrat' | 'republican' | 'tie' | 'unknown';

  let percentage = getPercentageFromString(fullPredictionString);
  if (Number.isNaN(percentage)) {
    console.error('Could not find percentage in string');
    outcome = 'unknown';
    return {
      outcome: outcome,
      percentage: 0,
    };
  }

  // Determine outcome
  if (
    percentage === 50 ||
    // If both candidates are mentioned, assume it's a tie
    (fullPredictionString.includes('Trump') &&
      fullPredictionString.includes('Biden'))
  ) {
    outcome = 'tie';
  } else if (
    // 538 & DecisionDesk use candidate's last names
    fullPredictionString.includes('Trump') ||
    // Economist uses 'R' and 'D'
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
  if (percentage < 50 && outcome !== 'unknown') {
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
