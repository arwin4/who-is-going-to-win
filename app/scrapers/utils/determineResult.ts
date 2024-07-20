export default function determineResult(fullPredictionString: string) {
  const percentageString = fullPredictionString.match(/^[^\d]*(\d+)/)?.at(1);

  if (!percentageString) {
    throw new Error('Could not find percentage in string');
  }

  // NOTE: percentageString is already expected to be an integer, so rounding may be overkill.
  let percentage = Math.round(parseFloat(percentageString));

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
