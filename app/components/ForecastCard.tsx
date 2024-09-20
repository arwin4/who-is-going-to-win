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
}: {
  candidate: string;
  percentage: RepPercentage | DemPercentage;
}) {
  if (percentage < 55) {
    return <div className="text-2xl font-semibold">{percentage}%</div>;
  }
  if (candidate === 'republican' && percentage >= 55 && percentage < 60) {
    return (
      <div className="text-2xl font-semibold underline decoration-red-300 underline-offset-4">
        {percentage}%
      </div>
    );
  }
  if (candidate === 'republican' && percentage >= 60 && percentage < 65) {
    return (
      <div className="text-2xl font-semibold underline decoration-red-400 underline-offset-4">
        {percentage}%
      </div>
    );
  }
  if (candidate === 'republican' && percentage >= 65) {
    return (
      <div className="text-2xl font-semibold underline decoration-red-500 underline-offset-4">
        {percentage}%
      </div>
    );
  }
  if (candidate === 'democrat' && percentage >= 55 && percentage < 60) {
    return (
      <div className="text-2xl font-semibold underline decoration-blue-300 underline-offset-4">
        {percentage}%
      </div>
    );
  }
  if (candidate === 'democrat' && percentage >= 60 && percentage < 65) {
    return (
      <div className="text-2xl font-semibold underline decoration-blue-400 underline-offset-4">
        {percentage}%
      </div>
    );
  }
  if (candidate === 'democrat' && percentage >= 65) {
    return (
      <div className="text-2xl font-semibold underline decoration-blue-500 underline-offset-4">
        {percentage}%
      </div>
    );
  }
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
        />
        <CandidateBanner candidate="democrat" />
        <div>—</div>
        <ForecastStat
          candidate="republican"
          percentage={forecast.repPercentage}
        />
        <CandidateBanner candidate="republican" />
      </div>
      <div className="mt-1 text-sm opacity-80">
        {forecast.lastUpdateText} ago
      </div>
    </>
  );
}

function Disclaimer({ forecast }: { forecast: Forecast }) {
  const isPolymarket = forecast.formattedName === 'Polymarket';

  if (!isPolymarket) return null;

  return (
    <div className="text-sm opacity-90">
      {isPolymarket && '(betting market, not a model)'}
    </div>
  );
}

export default function ForecastCard({ forecast }: { forecast: Forecast }) {
  return (
    <a href={forecast.url}>
      <div className="grid border-collapse space-y-3 rounded bg-slate-300 p-5 text-center shadow-md outline outline-2 outline-slate-400/60 hover:outline-slate-400 dark:bg-slate-700">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <ForecastData forecast={forecast} />
        <Disclaimer forecast={forecast} />
      </div>
    </a>
  );
}
