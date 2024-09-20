/* eslint-disable no-undef */
import { Redis } from '@upstash/redis';
import 'dotenv/config';

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    'Unable to find the Redis REST URL and/or token. Please grab these from the Upstash console and add these to your .env file',
  );
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function setupRedis() {
  console.log('Starting Redis setup using placeholder data...');

  try {
    await redis.hset('538', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'FiveThirtyEight',
      url: 'https://projects.fivethirtyeight.com/2024-election-forecast/',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('economist', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'The Economist',
      url: 'https://www.economist.com/interactive/us-2024-election/prediction-model/president',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('raceToTheWH', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'Race To The WH',
      url: 'https://www.racetothewh.com/president/2024',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('theHill', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'DecisionDeskHQ / The Hill',
      url: 'https://elections2024.thehill.com/forecast/2024/president/',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('nateSilver', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'Nate Silver',
      url: 'https://www.natesilver.net/p/nate-silver-2024-president-election-polls-model/',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('JHK', {
      repPercentage: 50,
      demPercentage: 50,
      outcome: 'tie',
      formattedName: 'JHK Forecasts',
      url: 'https://projects.jhkforecasts.com/2024/president/',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    await redis.hset('EBO', {
      repPercentage: 53,
      demPercentage: 46,
      outcome: 'democrat',
      formattedName: 'Election Betting Odds',
      url: 'https://electionbettingodds.com/',
      lastUpdate: new Date('2024-01-01T00:00:00.000Z'),
    });

    console.log(
      'Finished setting up Redis db. Please manually confirm the creation of the above hashes in the Redis Data Browser/CLI.',
    );
  } catch (error) {
    console.error('Failed to set up Redis db');
  }
}

setupRedis();
