import { ScrapingFunction, Source } from '~/types';
import {
  connectToMongoDB,
  disconnectMongoDB,
  findForecast,
  updatePredictionInMongoDB,
} from './scrapers/mongoManager';
import redis from './redis';

export default async function updatePrediction(
  source: Source,
  scraper: ScrapingFunction,
) {
  try {
    await connectToMongoDB();
    const prediction = await scraper();
    await updatePredictionInMongoDB(prediction, source);
    const forecast = await findForecast(source);
    await redis.set(source, JSON.stringify(forecast));
  } catch (error) {
    console.error(`Failed to update ${source}`);
  } finally {
    await disconnectMongoDB();
  }
}
