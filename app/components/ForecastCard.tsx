import type { DemPercentage, Forecast, RepPercentage } from '~/types';

function CandidateBanner({ candidate }: { candidate: string }) {
  let candidateString;
  if (candidate === 'republican') candidateString = 'Trump';
  if (candidate === 'democrat') candidateString = 'Harris';
  if (candidate === 'tie') candidateString = 'tied';
  if (candidate === 'unknown') candidateString = '(error)';

  return <div>{candidateString}</div>;
}

function ForecastStat({
  candidate,
  percentage,
  hasAdvantage,
}: {
  candidate: string;
  percentage: RepPercentage | DemPercentage;
  hasAdvantage: boolean;
}) {
  if (!hasAdvantage) {
    return <div className="text-2xl font-semibold">{percentage}%</div>;
  } else if (candidate === 'republican') {
    return (
      <div className="text-2xl font-semibold underline decoration-red-400 decoration-2 underline-offset-4">
        {percentage}%
      </div>
    );
  } else if (candidate === 'democrat') {
    return (
      <div className="text-2xl font-semibold underline decoration-blue-400 decoration-2 underline-offset-4">
        {percentage}%
      </div>
    );
  }
}

function LastUpdate() {
  return (
    <div className="mt-1 text-sm font-semibold opacity-80">
      Final probabilities
    </div>
  );
}

function ForecastData({ forecast }: { forecast: Forecast }) {
  if (forecast.outcome === 'unknown') {
    return <div className="">There was an error getting this forecast. </div>;
  }

  return (
    <>
      <div className="grid grid-flow-col items-center justify-center gap-2">
        <ForecastStat
          candidate="democrat"
          percentage={forecast.demPercentage}
          hasAdvantage={forecast.demPercentage > forecast.repPercentage}
        />
        <CandidateBanner candidate="democrat" />
        <div>—</div>
        <ForecastStat
          candidate="republican"
          percentage={forecast.repPercentage}
          hasAdvantage={forecast.repPercentage > forecast.demPercentage}
        />
        <CandidateBanner candidate="republican" />
      </div>
      <LastUpdate />
    </>
  );
}

function Disclaimer({ forecast }: { forecast: Forecast }) {
  const isEBO = forecast.formattedName === 'Election Betting Odds';

  if (!isEBO) return null;

  return (
    <div className="text-sm opacity-90">
      {isEBO && '(betting odds, not a model)'}
    </div>
  );
}

export default function ForecastCard({ forecast }: { forecast: Forecast }) {
  return (
    <a href={forecast.url}>
      <div className="grid border-collapse space-y-2 rounded bg-slate-300 p-4 text-center shadow-md outline outline-2 outline-slate-400/60 hover:outline-slate-400 dark:bg-slate-700">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <ForecastData forecast={forecast} />
        <Disclaimer forecast={forecast} />
      </div>
    </a>
  );
}
