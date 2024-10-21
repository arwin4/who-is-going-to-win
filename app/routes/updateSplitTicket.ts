import scrapeSplitTicket from '~/scrapers/scrapeSplitTicket';
import { ScrapingFunction, Source } from '~/types';
import updatePrediction from '~/utils/updatePrediction';

export const config = {
  maxDuration: 60,
};

// Configure source here
const source: Source = 'splitTicket';
const scraper: ScrapingFunction = scrapeSplitTicket;

export const loader = async ({ request }: { request: Request }) => {
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Not authorized', { status: 403 });
    }
  }

  try {
    await updatePrediction(source, scraper);
    // TODO: change to proper response and status code
    return true;
  } catch (err) {
    console.error(`Failed to update ${source}`);
    console.error(err);
    return false;
  }
};
