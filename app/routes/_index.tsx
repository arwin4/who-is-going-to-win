import { Link, useLoaderData } from '@remix-run/react';
import ForecastCard from '../components/ForecastCard.js';
import type { HeadersFunction } from '@vercel/remix';
import type { Forecast } from '~/types';
import redis from '../utils/redis';
import { formatDistanceToNowStrict } from 'date-fns';

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=60, stale-while-revalidate=60',
});

export const config = { runtime: 'edge' };

function getTimestampAsText(dateAsString: string) {
  const dateAsDate = new Date(dateAsString);
  return formatDistanceToNowStrict(dateAsDate);
}

export async function loader() {
  try {
    const forecasts = await Promise.all([
      await redis.hgetall<Forecast>('538'),
      await redis.hgetall<Forecast>('economist'),
      await redis.hgetall<Forecast>('polymarket'),
      await redis.hgetall<Forecast>('raceToTheWH'),
      await redis.hgetall<Forecast>('theHill'),
      await redis.hgetall<Forecast>('nateSilver'),
    ]);

    forecasts.map((forecast) => {
      if (!forecast) throw new Error();
      forecast.lastUpdateText = getTimestampAsText(forecast.lastUpdate);
    });

    return forecasts;
  } catch (err) {
    throw new Response('Unable to fetch (all) forecasts from database', {
      status: 500,
    });
  }
}

export default function Index() {
  const [
    fiveThirtyEight,
    economist,
    polymarket,
    raceToTheWH,
    theHill,
    nateSilver,
  ] = useLoaderData<typeof loader>();

  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold">
          Who Is Going To Win?
        </h1>
        <Link
          to="explanation"
          prefetch="render"
          className="grid grid-flow-col bg-slate-300 px-4 py-1 hover:bg-slate-400/50 dark:bg-slate-700"
          unstable_viewTransition
        >
          Predictions &mdash; not polling averages
          <img
            src="assets/info-icon.svg"
            className="w-7 self-center pl-2"
            alt="Information"
          />
        </Link>
      </div>
      <main className="m-4 mt-0 grid items-center gap-4 md:grid-flow-col ">
        <div className="grid gap-4">
          {/* FIXME: find a way to forgo type assertion */}
          <ForecastCard forecast={theHill as Forecast} />
          <ForecastCard forecast={economist as Forecast} />
          <ForecastCard forecast={fiveThirtyEight as Forecast} />
        </div>
        <div className="grid gap-4">
          <ForecastCard forecast={raceToTheWH as Forecast} />
          <ForecastCard forecast={nateSilver as Forecast} />
          <ForecastCard forecast={polymarket as Forecast} />
        </div>
      </main>
    </>
  );
}
