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
  forecast,
}: {
  candidate: string;
  forecast: Forecast;
}) {
  const outcome = forecast.outcome;
  const isFavored = candidate === outcome;

  let outcomeColor;
  if (outcome === 'republican') outcomeColor = 'bg-red-400';
  if (outcome === 'democrat') outcomeColor = 'bg-blue-400';
  if (outcome === 'tie' || outcome === 'unknown') outcomeColor = 'bg-gray-400';

  const favoredColor = `-skew-y-1 ${outcomeColor} p-1`;

  // Temporary hardcoded economist, need to update scraper
  if (forecast.id === 'theEconomist') {
    return (
      <div className="grid grid-flow-col items-center gap-2 gap-y-1">
        <div className="text-xl font-semibold">
          1<span className="text-lg"> in </span>2
        </div>
        <CandidateBanner candidate={candidate}></CandidateBanner>
      </div>
    );
  }

  return (
    <div className="grid grid-flow-col items-center gap-2 gap-y-1">
      <div
        className={
          isFavored
            ? `text-2xl font-semibold dark:text-gray-100 ${favoredColor}`
            : `text-2xl font-semibold`
        }
      >
        {candidate === 'democrat'
          ? forecast.demPercentage
          : forecast.repPercentage}
        %
      </div>
      <CandidateBanner candidate={candidate}></CandidateBanner>
    </div>
  );
}

function ForecastData({ forecast }: { forecast: Forecast }) {
  if (forecast.outcome === 'unknown') {
    return <div className="">There was an error getting this forecast. </div>;
  }

  return (
    <>
      <div className="grid grid-flow-col items-center justify-center gap-4">
        <ForecastStat candidate="democrat" forecast={forecast} />
        <div>—</div>
        <ForecastStat candidate="republican" forecast={forecast} />
      </div>
    </>
  );
}

function Disclaimer({ forecast }: { forecast: Forecast }) {
  const isNateSilver = forecast.id === 'nateSilver';
  const isPolymarket = forecast.id === 'polymarket';

  if (!isNateSilver && !isPolymarket) return null;

  return (
    <div className="text-sm opacity-90">
      {isNateSilver && '(on Aug 29)'}
      {isPolymarket && '(betting market, not a model)'}
    </div>
  );
}

export default function ForecastCard({
  forecast,
  isSuspended,
}: {
  forecast: Forecast;
  isSuspended: boolean;
}) {
  return (
    <a href={forecast.url}>
      <div className="grid border-collapse space-y-3 rounded bg-slate-300 p-5 text-center shadow-md outline outline-2 outline-slate-400/60 hover:outline-slate-400 dark:bg-slate-700">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        {isSuspended ? (
          <div className="mt-5 p-2">This forecast is currently suspended.</div>
        ) : (
          <ForecastData forecast={forecast} />
        )}

        <Disclaimer forecast={forecast} />
      </div>
    </a>
  );
}
