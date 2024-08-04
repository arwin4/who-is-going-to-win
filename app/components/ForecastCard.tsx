import type { Forecast, Outcome } from '~/types';

function OutcomeBanner({ outcome }: { outcome: Outcome }) {
  let outcomeColor;
  if (outcome === 'republican') outcomeColor = 'bg-red-400';
  if (outcome === 'democrat') outcomeColor = 'bg-blue-400';
  if (outcome === 'tie' || outcome === 'unknown') outcomeColor = 'bg-gray-400';

  let outcomeString;
  if (outcome === 'republican') outcomeString = 'Trump';
  if (outcome === 'democrat') outcomeString = 'Harris';
  if (outcome === 'tie') outcomeString = 'tied';
  if (outcome === 'unknown') outcomeString = '(error)';

  return <div className={`-skew-y-2 ${outcomeColor}`}>{outcomeString}</div>;
}

function ForecastStat({ forecast }: { forecast: Forecast }) {
  // Nate Silver's forecast is entered manually so needs a disclaimer
  const isNateSilver = forecast.id === 'nateSilver';

  if (isNateSilver)
    return (
      <div className="opacity-55">
        <div className="text-2xl font-semibold">{forecast.percentage}%</div>
        <span className="text-sm"> (on Aug 4)</span>
      </div>
    );
  return <div className="text-2xl font-semibold">{forecast.percentage}%</div>;
}

function ForecastData({ forecast }: { forecast: Forecast }) {
  if (forecast.outcome === 'unknown') {
    return <div className="">There was an error getting this forecast. </div>;
  }

  return (
    <>
      {forecast.id === 'polymarket' && '(betting market, not a model)'}
      <ForecastStat forecast={forecast} />
      <OutcomeBanner outcome={forecast.outcome} />
    </>
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
      <div
        className={`grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300 ${isSuspended && 'opacity-60'}`}
      >
        <h2 className="text-xl">{forecast.formattedName}</h2>
        {isSuspended ? (
          <div className="mt-5 bg-gray-400 p-2">
            This forecast is currently suspended.
          </div>
        ) : (
          <ForecastData forecast={forecast} />
        )}
      </div>
    </a>
  );
}
