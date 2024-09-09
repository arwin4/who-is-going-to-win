/**
 * @param fullString String containing a number (with or without decimals)
 * @returns First number encountered, rounded
 */
export const getPercentageFromString = (fullString: string): number => {
  const percentageStr = fullString.match(/[\d]+\.?[\d]?/)?.at(0);

  if (!percentageStr) return NaN;

  // NOTE: percentageString is already expected to be an integer, so rounding may be overkill.
  return Math.round(parseFloat(percentageStr));
};
