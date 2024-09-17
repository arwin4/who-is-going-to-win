import scrapeTheHill from '~/scrapers/scrapeTheHill';
import { ScrapingFunction, Source } from '~/types';
import updatePrediction from '~/utils/updatePrediction';

export const config = {
  maxDuration: 60,
};

// Configure source here
const source: Source = 'theHill';
const scraper: ScrapingFunction = scrapeTheHill;

export const loader = async ({ request }: { request: Request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Not authorized', { status: 403 });
  }

  try {
    await updatePrediction(source, scraper);
    // TODO: change to proper response and status code
    return true;
  } catch (error) {
    console.error(`Failed to update ${source}`);
    return false;
  }
};
