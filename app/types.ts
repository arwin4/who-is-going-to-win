export type Outcome = 'democrat' | 'republican' | 'tie' | 'unknown';
export type DemPercentage = number;
export type RepPercentage = number;
export type Source =
  | '538'
  | 'raceToTheWH'
  | 'economist'
  | 'theHill'
  | 'nateSilver'
  | 'JHK'
  | 'EBO';

export type Prediction = {
  outcome: Outcome;
  demPercentage: DemPercentage;
  repPercentage: RepPercentage;
};

export type Forecast = {
  outcome: Outcome;
  demPercentage: DemPercentage;
  repPercentage: RepPercentage;
  formattedName: string;
  url: string;
  lastUpdate: string;
  lastUpdateText?: string;
};

export type Forecasts = {
  economist: Forecast;
  fiveThirtyEight: Forecast;
  nateSilver: Forecast;
  EBO: Forecast;
  theHill: Forecast;
  raceToTheWH: Forecast;
};

export type ScrapingFunction = () => Promise<Prediction>;
