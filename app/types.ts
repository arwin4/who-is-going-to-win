export type Outcome = 'democrat' | 'republican' | 'tie' | 'unknown';
export type WinnerPercentage = number;

export type Prediction = {
  outcome: Outcome;
  percentage: WinnerPercentage;
};

export type Forecast = {
  _id: string;
  id: string;
  outcome: Outcome;
  percentage: WinnerPercentage;
  formattedName: string;
  url: string;
};

// https://stackoverflow.com/a/78174529/22857578
export interface RouteError {
  data: string;
  error: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
    message: string;
    stack: string;
  };
  internal: boolean;
  status: number;
  statusText: string;
}
