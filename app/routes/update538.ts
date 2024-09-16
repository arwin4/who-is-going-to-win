import scrape538 from '~/scrapers/scrape538';
import updatePrediction from '~/utils/updatePrediction';

export const config = {
  maxDuration: 60,
};

export const loader = async ({ request }: { request: Request }) => {
  // TODO: export auth
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return false;
  }

  try {
    await updatePrediction('538', scrape538);
    // TODO: change to proper response and status code
    return true;
  } catch (error) {
    console.error(`Failed to update 538`);
    return false;
  }
};
