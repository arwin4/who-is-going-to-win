export default function ForecastCard({ forecast }) {
  const demColor = 'bg-blue-400';
  const repColor = 'bg-red-400';

  return (
    <a href={forecast.url}>
      <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <div
          className={`text-2xl font-semibold ${!forecast.percentage ? 'opacity-70' : ''}`}
        >
          {forecast.percentage ? `${forecast.percentage}%` : `(paywalled)`}
        </div>
        <div
          className={`-skew-y-2 ${forecast.outcome === 'republican' ? repColor : demColor}`}
        >
          {forecast.outcome === 'republican' ? 'Trump' : 'Biden'}
        </div>
      </div>
    </a>
  );
}
