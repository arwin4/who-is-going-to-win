import type { LoaderFunction } from '@remix-run/node';
import { mongodb } from '~/db.server';
import redis from '~/utils/redis';
import scrapeAndSave from '~/utils/scrapeAndSave';

async function getMongoDBData() {
  const db = mongodb.db('db');
  const collection = db.collection('test');

  const lastScrapeDoc = await collection.findOne({ id: 'lastScrape' });
  if (!lastScrapeDoc) throw new Error();

  const [theHill, nateSilver, fiveThirtyEight, economist] = await Promise.all([
    collection.findOne({ id: 'theHill' }),
    collection.findOne({ id: 'nateSilver' }),
    collection.findOne({ id: 'fiveThirtyEight' }),
    collection.findOne({ id: 'theEconomist' }),
  ]);

  const forecasts = {
    theHill,
    nateSilver,
    fiveThirtyEight,
    economist,
  };

  const lastScrapeTime = new Date(lastScrapeDoc.lastScrapeTime);

  return { forecasts, lastScrapeTime };
}

export const loader: LoaderFunction = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return false;
  // }

  try {
    await scrapeAndSave();
    const { forecasts, lastScrapeTime } = await getMongoDBData();

    console.log('Scraped and saved new data to MongoDB.');
    await redis.mset({
      forecasts: JSON.stringify(forecasts),
      lastScrapeTime: JSON.stringify(lastScrapeTime),
    });
    console.log('Pushed new data to Redis');

    return true;
  } catch (error) {
    console.error('Scrape failed:', error);
    return false;
  }
};
