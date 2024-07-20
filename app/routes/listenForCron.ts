import type { LoaderFunction } from '@remix-run/node';
import scrapeAndSave from '~/utils/scrapeAndSave';

export const loader: LoaderFunction = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return false;
  }

  try {
    await scrapeAndSave();
    console.log('Scraped and saved new data.');
    return true;
  } catch (error) {
    console.error('Scrape failed:', error);
    return false;
  }
};
