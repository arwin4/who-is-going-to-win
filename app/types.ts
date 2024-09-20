export type Outcome = 'democrat' | 'republican' | 'tie' | 'unknown';
export type DemPercentage = number;
export type RepPercentage = number;
export type Source =
  | '538'
  | 'polymarket'
  | 'raceToTheWH'
  | 'economist'
  | 'theHill'
  | 'nateSilver'
  | 'JHK';

export type Prediction = {
  outcome: Outcome;
  demPercentage: DemPercentage;
  repPercentage: RepPercentage;
};

export type Forecast = {
  _id: string;
  id: string;
  outcome: Outcome;
  demPercentage: DemPercentage;
  repPercentage: RepPercentage;
  formattedName: string;
  url: string;
  lastUpdate: string;
  lastUpdateText: string;
};

export type Forecasts = {
  economist: Forecast;
  fiveThirtyEight: Forecast;
  nateSilver: Forecast;
  polymarket: Forecast;
  theHill: Forecast;
  raceToTheWH: Forecast;
};

export type ScrapingFunction = () => Promise<Prediction>;

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
