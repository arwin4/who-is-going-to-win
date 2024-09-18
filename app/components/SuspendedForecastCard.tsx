export default function SuspendedForecastCard({
  url,
  formattedName,
}: {
  url: string;
  formattedName: string;
}) {
  return (
    <a href={url}>
      <div className="grid border-collapse space-y-3 rounded bg-slate-300 p-5 text-center shadow-md outline outline-2 outline-slate-400/60 hover:outline-slate-400 dark:bg-slate-700">
        <h2 className="text-xl">{formattedName}</h2>
        <div className="mt-5 p-2">This forecast is currently suspended.</div>
      </div>
    </a>
  );
}
