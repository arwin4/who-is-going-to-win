import { ScrapingFunction, Source } from '~/types';
import redis from './redis';

export default async function updatePrediction(
  source: Source,
  scraper: ScrapingFunction,
) {
  try {
    console.log(`Updating ${source}...`);

    const prediction = await scraper();
    await redis.hset(source, {
      ...prediction,
      lastUpdate: new Date(),
    });
  } catch (err) {
    console.error(`Failed to update ${source}`);
    console.error(err);
  }
}
