import scrapeAndSave from '~/utils/scrapeAndSave';
import redis from '../utils/redis';
import mongoose from 'mongoose';

export const config = {
  maxDuration: 60,
};

async function getMongoDBData() {
  const collection = mongoose.connection.collection('test');

  const lastScrapeDoc = await collection.findOne({ id: 'lastScrape' });
  console.log(lastScrapeDoc);

  if (!lastScrapeDoc) throw new Error();

  const [theHill, nateSilver, fiveThirtyEight, economist, polymarket] =
    await Promise.all([
      collection.findOne({ id: 'theHill' }),
      collection.findOne({ id: 'nateSilver' }),
      collection.findOne({ id: 'fiveThirtyEight' }),
      collection.findOne({ id: 'theEconomist' }),
      collection.findOne({ id: 'polymarket' }),
    ]);

  const forecasts = {
    theHill,
    nateSilver,
    fiveThirtyEight,
    economist,
    polymarket,
  };

  const lastScrapeTime = new Date(lastScrapeDoc.lastScrapeTime);

  return { forecasts, lastScrapeTime };
}

export const loader = async ({ request }: { request: Request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return false;
  }

  try {
    await scrapeAndSave();
    const { forecasts, lastScrapeTime } = await getMongoDBData();

    console.log('Scraped and saved new data to MongoDB.');
    mongoose.disconnect();

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
