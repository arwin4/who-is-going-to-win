function OutcomeBanner({ outcome }) {
  let outcomeColor;
  if (outcome === 'republican') outcomeColor = 'bg-red-400';
  if (outcome === 'democrat') outcomeColor = 'bg-blue-400';
  if (outcome === 'tie') outcomeColor = 'bg-gray-400';

  let outcomeString;
  if (outcome === 'republican') outcomeString = 'Trump';
  if (outcome === 'democrat') outcomeString = 'Biden';
  if (outcome === 'tie') outcomeString = 'tied';

  return <div className={`-skew-y-2 ${outcomeColor}`}>{outcomeString}</div>;
}

export default function ForecastCard({ forecast }) {
  return (
    <a href={forecast.url}>
      <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <div
          className={`text-2xl font-semibold ${!forecast.percentage ? 'opacity-70' : ''}`}
        >
          {forecast.percentage ? `${forecast.percentage}%` : `(paywalled)`}
        </div>
        <OutcomeBanner outcome={forecast.outcome} />
      </div>
    </a>
  );
}
