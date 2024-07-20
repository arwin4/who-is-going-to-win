import type { LoaderFunction } from '@remix-run/node';
import scrapeAndSave from '~/utils/scrapeAndSave';

export const loader: LoaderFunction = async () => {
  // Check for a secret key to ensure the request is from your cron service
  // const authHeader = request.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    await scrapeAndSave();
    console.log('Scraped and saved new data.');
    return true;
  } catch (error) {
    console.error('Scrape failed:', error);
    return false;
  }
};
