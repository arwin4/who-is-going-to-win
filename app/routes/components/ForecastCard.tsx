function OutcomeBanner({ outcome }) {
  let outcomeColor;
  if (outcome === 'republican') outcomeColor = 'bg-red-400';
  if (outcome === 'democrat') outcomeColor = 'bg-blue-400';
  if (outcome === 'tie' || outcome === 'unknown') outcomeColor = 'bg-gray-400';

  let outcomeString;
  if (outcome === 'republican') outcomeString = 'Trump';
  if (outcome === 'democrat') outcomeString = 'Biden';
  if (outcome === 'tie') outcomeString = 'tied';
  if (outcome === 'unknown') outcomeString = '(error)';

  return <div className={`-skew-y-2 ${outcomeColor}`}>{outcomeString}</div>;
}

function ForecastStat({ forecast }) {
  // Nate Silver's forecast is entered manually so needs a disclaimer
  const isNateSilver = forecast.id === 'nateSilver';
  return (
    <div
      className={`text-2xl font-semibold ${isNateSilver ? 'opacity-40' : ''}`}
    >
      {forecast.percentage}%{isNateSilver && '*'}
    </div>
  );
}

export default function ForecastCard({ forecast }) {
  return (
    <a href={forecast.url}>
      <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <ForecastStat forecast={forecast} />
        <OutcomeBanner outcome={forecast.outcome} />
      </div>
    </a>
  );
}
