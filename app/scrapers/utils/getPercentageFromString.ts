export const getPercentageFromString = (fullString: string): number => {
  const percentageStr = fullString.match(/^[^\d]*(\d+)/)?.at(1);

  if (!percentageStr) return NaN;

  // NOTE: percentageString is already expected to be an integer, so rounding may be overkill.
  return Math.round(parseFloat(percentageStr));
};
