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
  percentage,
}: {
  percentage: RepPercentage | DemPercentage;
}) {
  return <div className="text-2xl font-semibold">{percentage}%</div>;
}

function ForecastData({
  forecast,
  final,
}: {
  forecast: Forecast;
  final: boolean;
}) {
  if (forecast.outcome === 'unknown') {
    return <div className="">There was an error getting this forecast. </div>;
  }

  return (
    <>
      <div className="grid grid-flow-col items-center justify-center gap-2">
        <ForecastStat percentage={forecast.demPercentage} />
        <CandidateBanner candidate="democrat" />
        <div>—</div>
        <ForecastStat percentage={forecast.repPercentage} />
        <CandidateBanner candidate="republican" />
      </div>
      {final ? (
        <div className="mt-1 text-sm font-semibold italic tracking-wide opacity-80">
          Final
        </div>
      ) : (
        <div className="mt-1 text-sm opacity-80">
          {forecast.lastUpdateText} ago
        </div>
      )}
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

export default function ForecastCard({
  forecast,
  final,
}: {
  forecast: Forecast;
  final?: boolean;
}) {
  return (
    <a href={forecast.url}>
      <div className="grid border-collapse space-y-2 rounded bg-slate-300 p-4 text-center shadow-md outline outline-2 outline-slate-400/60 hover:outline-slate-400 dark:bg-slate-700">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <ForecastData forecast={forecast} final={Boolean(final)} />
        <Disclaimer forecast={forecast} />
      </div>
    </a>
  );
}
