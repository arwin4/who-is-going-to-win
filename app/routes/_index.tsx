import { useLoaderData } from '@remix-run/react';
import { formatDistanceToNow } from 'date-fns';
import ForecastCard from '../components/ForecastCard.js';
import type { HeadersFunction } from '@vercel/remix';
import type { Forecast } from '~/types';
import redis from '../utils/redis';

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

    return { forecasts, lastScrapeTime };
  } catch (err) {
    console.error('Unable to fetch forecasts from database');
    throw new Response('Unable to fetch forecasts from database', {
      status: 500,
    });
  }
}

export default function Index() {
  const { forecasts, lastScrapeTime } = useLoaderData<typeof loader>();

  const lastUpdate = formatDistanceToNow(lastScrapeTime);

  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans md:mb-4">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold">
          Who Is Going To Win?
        </h1>
        <h2>A presidential election forecast aggregator</h2>
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
      <footer className="m-2 mx-6 mb-10 pt-8 text-gray-600">
        <div className="text-center">
          Last updated {lastUpdate} ago. Updates every hour.
        </div>
        <div className="mt-2 max-w-xl text-center text-sm">
          This overview is meant as a quick reference only. Please click on a
          forecast&apos;s card to see details and methodology.
        </div>
        <div className="mt-2 max-w-xl text-center text-xs">
          * Nate Silver&apos;s forecast is behind a paywall. Therefore, its
          prediction here is not updated automatically. It is updated manually
          only{' '}
          <a
            className="underline hover:text-gray-500 hover:decoration-gray-500"
            href="https://x.com/NateSilver538/status/1818324321645064416"
          >
            when Silver publicly mentions its current prediction
          </a>
          . To see the current prediction,{' '}
          <a
            className="underline hover:text-gray-500 hover:decoration-gray-500"
            href="https://www.natesilver.net/p/nate-silver-2024-president-election-polls-model"
          >
            subscribe to his newsletter
          </a>
          .
        </div>
      </footer>
    </>
  );
}
