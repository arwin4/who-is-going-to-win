export default function determineResult(fullPredictionString) {
  let percentage = fullPredictionString.match(/^[^\d]*(\d+)/)?.at(1);
  console.log(percentage);

  if (!percentage) {
    throw new Error('Could not find percentage in string');
  }

  // Determine outcome
  // let outcome: 'democrat' | 'republican' | 'tie';
  let outcome = '';

  if (percentage === '50') {
    outcome = 'tie';
  } else if (
    (fullPredictionString.includes('Trump') &&
      fullPredictionString.includes('Biden')) ||
    (!fullPredictionString.includes('Trump') &&
      !fullPredictionString.includes('Biden'))
  ) {
    outcome = 'tie';
  } else if (fullPredictionString.includes('Trump')) {
    outcome = 'republican';
  } else if (fullPredictionString.includes('Biden')) {
    outcome = 'democrat';
  }

  if (parseFloat(percentage) < 50) {
    percentage = 100 - percentage;
    if (outcome === 'republican') {
      outcome = 'democrat';
    } else if (outcome === 'democrat') {
      outcome = 'republican';
    }
  }

  console.log(outcome);
  console.log(percentage);

  console.log(fullPredictionString);

  return {
    outcome: outcome,
    percentage: percentage,
  };
}
