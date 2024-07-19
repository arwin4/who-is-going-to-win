import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from 'react-router-dom';
import { mongodb } from '../db.server';
import { formatDistanceToNow } from 'date-fns';
import scrapeAndSave from '~/utils/scrapeAndSave';
import ForecastCard from './components/ForecastCard';

export const meta: MetaFunction = () => {
  return [
    { title: 'Presidential forecast aggregator' },
    { name: 'description', content: 'Presidential forecast aggregator' },
  ];
};

async function getLastScrapeTime() {
  const db = mongodb.db('db');
  const collection = db.collection('test');

  let lastScrapeDoc;

  try {
    lastScrapeDoc = await collection.findOne({ id: 'lastScrape' });
    if (!lastScrapeDoc) throw new Error();

    return lastScrapeDoc.lastScrapeTime;
  } catch (err) {
    console.error('Unable to get last scrape time', err);
  }
}

async function isNewScrapeNeeded(lastScrapeTime: number) {
  try {
    const timeDifference = (Date.now() - lastScrapeTime) / 3600000;
    if (timeDifference > 1) {
      return true;
    }
  } catch (err) {
    console.error('Unable to check if new scrape is needed', err);
    return false;
  }
}

export async function loader() {
  const lastScrapeTime = await getLastScrapeTime();

  if (await isNewScrapeNeeded(lastScrapeTime)) {
    console.log('New scrape needed. Starting scrape...');
    scrapeAndSave();
  }

  let theHill, nateSilver, fiveThirtyEight;

  // Fetch data from db
  try {
    const db = mongodb.db('db');
    const collection = db.collection('test');
    theHill = await collection.findOne({ id: 'theHill' });
    nateSilver = await collection.findOne({ id: 'nateSilver' });
    fiveThirtyEight = await collection.findOne({ id: 'fiveThirtyEight' });

    // TODO: try...catch db error

    const forecasts = {
      theHill,
      nateSilver,
      fiveThirtyEight,
    };

    return { forecasts, lastScrapeTime };
  } catch (err) {
    console.error('Unable to fetch forecasts from db');
  }
}

export default function Index() {
  const { forecasts, lastScrapeTime } = useLoaderData();

  const lastUpdate = formatDistanceToNow(new Date(lastScrapeTime));

  const lastUpdateWasOverAnHourAgo =
    Date.now() - new Date(lastScrapeTime) > 3600000;

  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-3xl">Presidential forecast aggregator</h1>
      </div>
      <main className="grid space-y-6 sm:grid-flow-col sm:space-x-6 sm:space-y-0">
        <ForecastCard forecast={forecasts.theHill} />
        <ForecastCard forecast={forecasts.nateSilver} />
        <ForecastCard forecast={forecasts.fiveThirtyEight} />
      </main>
      <footer className="m-2 pt-8 text-gray-600">
        <div className="text-center">
          Last update: {lastUpdate} ago.
          {lastUpdateWasOverAnHourAgo
            ? ' Refresh for the latest data.'
            : ' Updates every hour.'}
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
            href="https://www.natesilver.net/p/why-i-dont-buy-538s-new-election"
          >
            when Silver publicly mentions its current prediction
          </a>
          . To see the current prediction,{' '}
          <a
            className="underline hover:text-gray-500 hover:decoration-gray-500"
            href="https://www.natesilver.net/p/nate-silver-2024-president-election-polls-model"
          >
            subscribe
          </a>
          .
        </div>
      </footer>
    </>
  );
}
