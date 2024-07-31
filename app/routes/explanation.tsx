import { Link, useLoaderData } from '@remix-run/react';
import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import redis from '../utils/redis';

export const config = { runtime: 'edge' };

export async function loader() {
  try {
    const lastScrapeDoc = await redis.get('lastScrapeTime');

    const lastScrapeTime = new Date(lastScrapeDoc);

    return { lastScrapeTime };
  } catch (err) {
    console.error('Unable to fetch last scrape time from database');
    throw new Response('Unable to fetch last scrape time from database', {
      status: 500,
    });
  }
}

export default function Explanation(): React.JSX.Element {
  const { lastScrapeTime } = useLoaderData<typeof loader>();

  const lastUpdate = formatDistanceToNowStrict(lastScrapeTime);
  return (
    <>
      <main className="m-4 mx-6 grid max-w-xl gap-4 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center text-gray-600 shadow-lg">
        <div>
          This site displays an overview of the current forecasts for the 2024
          US presidential election,{' '}
          <span className="font-semibold">refreshed every hour</span>.
        </div>
        <div>
          The information is provided as a quick reference only. Please click on
          a forecast&apos;s card to see details and methodology.
        </div>
        <div className="text-sm">
          * Nate Silver&apos;s forecast is behind a paywall. Therefore, its
          prediction is updated manually only{' '}
          <a
            className="underline hover:text-gray-500 hover:decoration-gray-500"
            href="https://x.com/NateSilver538/status/1818324321645064416"
          >
            when Silver mentions its current prediction publicly
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
        <div className="text-sm">
          Forecasts were refreshed{' '}
          <span className="font-semibold">{lastUpdate} ago</span>.
        </div>
      </main>
      <Link
        className="mb-4 text-xl font-semibold text-gray-600 underline hover:text-gray-500 hover:decoration-gray-500"
        to="/"
        unstable_viewTransition
      >
        Back to overview
      </Link>
    </>
  );
}
