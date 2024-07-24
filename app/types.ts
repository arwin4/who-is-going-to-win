export type Outcome = 'democrat' | 'republican' | 'tie' | 'unknown';
export type WinnerPercentage = number;

export type Prediction = {
  outcome: Outcome;
  percentage: WinnerPercentage;
};

export type Forecast = {
  _id: string;
  id: string;
  outcome: string;
  percentage: number | null;
  formattedName: string;
  url: string;
};
