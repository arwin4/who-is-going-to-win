import mongoose from 'mongoose';

// Scrapers
import scrapeFiveThirtyEight from '~/scrapers/scrapeFiveThirtyEight';
import scrapeTheEconomist from '~/scrapers/scrapeTheEconomist';
import scrapeTheHill from '~/scrapers/scrapeTheHill';
import getPolymarket from '~/scrapers/getPolymarket';
import scrapeRaceToTheWH from '~/scrapers/scrapeRaceToTheWH';

export default async function scrapeAndSave() {
  const [
    theHillResult,
    fiveThirtyEightResult,
    theEconomistResult,
    polymarketResult,
    raceToTheWHResult,
  ] = await Promise.all([
    await scrapeTheHill(),
    await scrapeFiveThirtyEight(),
    await scrapeTheEconomist(),
    await getPolymarket(),
    await scrapeRaceToTheWH(),
  ]);

  console.log('Completed scraping.');

  const connectionString = process.env.CONNECTION_STRING || '';

  await mongoose.connect(connectionString);

  const collection = mongoose.connection.collection('test');

  if (theHillResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'theHill' },
        {
          $set: {
            outcome: theHillResult.outcome,
            demPercentage: theHillResult.demPercentage,
            repPercentage: theHillResult.repPercentage,
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
            demPercentage: fiveThirtyEightResult.demPercentage,
            repPercentage: fiveThirtyEightResult.repPercentage,
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
            demPercentage: theEconomistResult.demPercentage,
            repPercentage: theEconomistResult.repPercentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new Economist data');
    }
  }

  if (polymarketResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'polymarket' },
        {
          $set: {
            outcome: polymarketResult.outcome,
            demPercentage: polymarketResult.demPercentage,
            repPercentage: polymarketResult.repPercentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new Polymarket data');
    }
  }

  if (raceToTheWHResult) {
    try {
      await collection.findOneAndUpdate(
        { id: 'raceToTheWH' },
        {
          $set: {
            outcome: raceToTheWHResult.outcome,
            demPercentage: raceToTheWHResult.demPercentage,
            repPercentage: raceToTheWHResult.repPercentage,
          },
        },
      );
    } catch (err) {
      console.error('Unable to update db with new RaceToTheWH data');
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
