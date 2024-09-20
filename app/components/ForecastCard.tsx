import type { Forecast } from '~/types';

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
  percentage: number;
}) {
  const getColorIntensity = (percentage: number) => {
    if (percentage >= 65) return '500';
    if (percentage >= 60) return '400';
    return '300';
  };

  const getUnderlineColor = (candidate: string, percentage: number) => {
    if (percentage < 55) return '';
    const color = candidate === 'republican' ? 'red' : 'blue';
    const intensity = getColorIntensity(percentage);
    return `underline decoration-${color}-${intensity} underline-offset-4`;
  };

  return (
    <div
      className={`text-2xl font-semibold ${getUnderlineColor(candidate, percentage)}`}
    >
      {percentage}%
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
