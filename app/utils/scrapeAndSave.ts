import { mongodb } from '~/db.server';

// Scrapers
import scrapeFiveThirtyEight from '~/scrapers/scrapeFiveThirtyEight';
import scrapeTheEconomist from '~/scrapers/scrapeTheEconomist';
import scrapeTheHill from '~/scrapers/scrapeTheHill';

export default async function scrapeAndSave() {
  type ScrapeResult = {
    outcome: 'democrat' | 'republican' | 'tie' | 'unknown';
    percentage: number;
  };

  let theHillResult: ScrapeResult | undefined;
  let fiveThirtyEightResult: ScrapeResult | undefined;
  let theEconomistResult: ScrapeResult | undefined;

  try {
    theHillResult = await scrapeTheHill();
  } catch (err) {
    console.error('Unable to scrape The Hill');
  }

  try {
    fiveThirtyEightResult = await scrapeFiveThirtyEight();
  } catch (err) {
    console.error('Unable to scrape FiveThirtyEight');
  }

  try {
    theEconomistResult = await scrapeTheEconomist();
  } catch (err) {
    console.error('Unable to scrape The Economist');
  }

  const db = mongodb.db('db');
  const collection = db.collection('test');

  if (theHillResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'theHill' },
        {
          $set: {
            outcome: theHillResult.outcome,
            percentage: theHillResult.percentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new The Hill data');
    }
  }

  if (fiveThirtyEightResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'fiveThirtyEight' },
        {
          $set: {
            outcome: fiveThirtyEightResult.outcome,
            percentage: fiveThirtyEightResult.percentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new FiveThirtyEight data');
    }
  }

  if (theEconomistResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'theEconomist' },
        {
          $set: {
            outcome: theEconomistResult.outcome,
            percentage: theEconomistResult.percentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new Economist data');
    }
  }

  // Update scrape time
  try {
    await collection.findOneAndUpdate(
      { id: 'lastScrape' },
      { $set: { lastScrapeTime: new Date() } },
    );
  } catch (err) {
    console.log('Unable to update scrape time');
  }
}
