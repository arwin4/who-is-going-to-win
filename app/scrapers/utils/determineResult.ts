export default function determineResult(fullPredictionString) {
  const percentage = fullPredictionString
    .match(/(\d+(\.\d+)?%)/g)
    ?.at(0)
    ?.replace('%', '');

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

  console.log(outcome);
  console.log(percentage);

  console.log(fullPredictionString);

  return {
    outcome: outcome,
    percentage: percentage,
  };
}
