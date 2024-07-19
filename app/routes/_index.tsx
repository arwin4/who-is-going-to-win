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

export async function loader() {
  // const result = await scrape();
  // console.log(result);

  const db = mongodb.db('db');
  const collection = db.collection('test');
  const lastScrapeDoc = await collection.findOne({ id: 'lastScrape' });
  const lastScrapeTime = lastScrapeDoc.lastScrapeTime;
  const timeDifference = (Date.now() - lastScrapeTime) / 3600000;
  if (timeDifference > 1) {
    // 1 hour
    scrapeAndSave();
  }

  const theHill = await collection.findOne({ id: 'theHill' });
  const nateSilver = await collection.findOne({ id: 'nateSilver' });
  const fiveThirtyEight = await collection.findOne({ id: 'fiveThirtyEight' });

  const forecasts = {
    theHill,
    nateSilver,
    fiveThirtyEight,
  };

  return { forecasts, lastScrapeTime };
}

export default function Index() {
  const { forecasts, lastScrapeTime } = useLoaderData();

  const lastUpdate = formatDistanceToNow(new Date(lastScrapeTime));

  const lastUpdateWasOverAnHourAgo =
    Date.now() - new Date(lastScrapeTime) > 3600000;
  console.log(lastUpdateWasOverAnHourAgo);

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
      <footer className="text-gray-600">
        Last update: {lastUpdate} ago
        {lastUpdateWasOverAnHourAgo && '. Refresh for the latest data.'}
      </footer>
    </>
  );
}
