export type Outcome = 'democrat' | 'republican' | 'tie' | 'unknown';
export type WinnerPercentage = number;

export type Prediction = {
  outcome: Outcome;
  percentage: WinnerPercentage;
};
