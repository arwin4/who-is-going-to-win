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

export async function loader() {
  try {
    const [
      fiveThirtyEight,
      economist,
      polymarket,
      raceToTheWH,
      theHill,
      nateSilver,
    ] = await redis.mget<
      [Forecast, Forecast, Forecast, Forecast, Forecast, Forecast]
    >('538', 'economist', 'polymarket', 'raceToTheWH', 'theHill', 'nateSilver');

    // Format timestamps server-side
    fiveThirtyEight.lastUpdateText = formatDistanceToNowStrict(
      new Date(fiveThirtyEight.lastUpdate),
    );
    economist.lastUpdateText = formatDistanceToNowStrict(
      new Date(economist.lastUpdate),
    );
    polymarket.lastUpdateText = formatDistanceToNowStrict(
      new Date(polymarket.lastUpdate),
    );
    raceToTheWH.lastUpdateText = formatDistanceToNowStrict(
      new Date(raceToTheWH.lastUpdate),
    );
    theHill.lastUpdateText = formatDistanceToNowStrict(
      new Date(theHill.lastUpdate),
    );
    nateSilver.lastUpdateText = formatDistanceToNowStrict(
      new Date(nateSilver.lastUpdate),
    );

    return {
      fiveThirtyEight,
      economist,
      polymarket,
      raceToTheWH,
      theHill,
      nateSilver,
    };
  } catch (err) {
    console.error('Unable to fetch forecasts from database');
    throw new Response('Unable to fetch forecasts from database', {
      status: 500,
    });
  }
}

export default function Index() {
  const {
    fiveThirtyEight,
    economist,
    polymarket,
    raceToTheWH,
    theHill,
    nateSilver,
  } = useLoaderData<typeof loader>();

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
          A presidential election forecast aggregator
          <img
            src="assets/info-icon.svg"
            className="w-7 self-center pl-2"
            alt="Information"
          />
        </Link>
      </div>
      <main className="m-4 mt-0 grid items-center gap-4 md:grid-flow-col ">
        <div className="grid gap-4">
          <ForecastCard forecast={theHill} isSuspended={false} />
          <ForecastCard forecast={economist} isSuspended={false} />
          <ForecastCard forecast={fiveThirtyEight} isSuspended={false} />
        </div>
        <div className="grid gap-4">
          <ForecastCard forecast={raceToTheWH} isSuspended={false} />
          <ForecastCard forecast={polymarket} isSuspended={false} />
          <ForecastCard forecast={nateSilver} isSuspended={false} />
        </div>
      </main>
    </>
  );
}
