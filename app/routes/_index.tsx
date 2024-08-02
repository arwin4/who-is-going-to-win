import { Link, useLoaderData } from '@remix-run/react';
import ForecastCard from '../components/ForecastCard.js';
import type { HeadersFunction } from '@vercel/remix';
import type { Forecast } from '~/types';
import redis from '../utils/redis';
import { formatDistanceToNowStrict } from 'date-fns';

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=1800, stale-while-revalidate=60',
});

export const config = { runtime: 'edge' };

export async function loader() {
  try {
    const [forecasts, lastScrapeDoc] = await redis.mget(
      'forecasts',
      'lastScrapeTime',
    );

    const lastScrapeTime = new Date(lastScrapeDoc);
    const lastUpdateText = formatDistanceToNowStrict(lastScrapeTime);

    return { forecasts, lastUpdateText };
  } catch (err) {
    console.error('Unable to fetch forecasts from database');
    throw new Response('Unable to fetch forecasts from database', {
      status: 500,
    });
  }
}

export default function Index() {
  const { forecasts, lastUpdateText } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold">
          Who Is Going To Win?
        </h1>
        <Link
          to="explanation"
          prefetch="render"
          className="grid grid-flow-col bg-slate-300 px-4 py-1 hover:bg-slate-400/50"
          unstable_viewTransition
        >
          A presidential election forecast aggregator
          <img
            src="assets/info-icon.svg"
            className="w-7 self-center pl-2"
            alt="Information"
          />
        </Link>
        <div className="mt-2 text-sm opacity-80">
          Updated {lastUpdateText} ago
        </div>
      </div>
      <main className="m-4 mt-0 grid items-center gap-6 md:grid-flow-col md:space-x-4 md:space-y-0">
        <div className="space-x-4 space-y-4 md:space-x-4">
          <ForecastCard
            forecast={forecasts.nateSilver as Forecast}
            isSuspended={false}
          />
          <ForecastCard
            forecast={forecasts.polymarket as Forecast}
            isSuspended={false}
          />
        </div>
        <div className="space-x-4 space-y-4 md:space-x-4">
          <ForecastCard
            forecast={forecasts.theHill as Forecast}
            isSuspended={true}
          />
          <ForecastCard
            forecast={forecasts.economist as Forecast}
            isSuspended={true}
          />
          <ForecastCard
            forecast={forecasts.fiveThirtyEight as Forecast}
            isSuspended={true}
          />
        </div>
      </main>
    </>
  );
}
