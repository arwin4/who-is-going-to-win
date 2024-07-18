import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from 'react-router-dom';
import { mongodb } from '../db.server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatDistanceToNow } from 'date-fns';

export const meta: MetaFunction = () => {
  return [
    { title: 'Presidential forecast aggregator' },
    { name: 'description', content: 'Presidential forecast aggregator' },
  ];
};

async function scrapeTheHill() {
  const response = await axios.get(
    'https://elections2024.thehill.com/forecast/2024/president/',
  );
  const html = response.data;

  const $ = cheerio.load(html);

  const targetElement = $('p:contains("Our model currently predicts that")');

  // Extract the complete text content of the element
  const fullPredictionString = targetElement.text();

  if (!fullPredictionString) {
    throw new Error('Could not find the prediction');
  }

  const percentage = fullPredictionString
    .match(/(\d+(\.\d+)?%)/g)
    ?.at(0)
    ?.replace('%', '');

  if (!percentage) {
    throw new Error('Could not find percentage in string');
  }

  // Determine outcome
  // let outcome: 'democrat' | 'republican' | 'tie';
  let outcome = '';

  if (percentage === '50') {
    outcome = 'tie';
  } else if (
    (fullPredictionString.includes('Trump') &&
      fullPredictionString.includes('Biden')) ||
    (!fullPredictionString.includes('Trump') &&
      !fullPredictionString.includes('Biden'))
  ) {
    outcome = 'tie';
  } else if (fullPredictionString.includes('Trump')) {
    outcome = 'republican';
  } else if (fullPredictionString.includes('Biden')) {
    outcome = 'democrat';
  }

  console.log(outcome);
  console.log(percentage);

  console.log(fullPredictionString);

  return {
    outcome: outcome,
    percentage: percentage,
  };
}

async function scrapeAndSave() {
  const theHillResult = await scrapeTheHill();
  console.log(theHillResult);

  const db = mongodb.db('db');
  const collection = db.collection('test');

  await collection.findOneAndUpdate(
    { id: 'theHill' },
    {
      $set: {
        outcome: theHillResult.outcome,
        percentage: theHillResult.percentage,
      },
    },
  );

  // Update scrape time
  await collection.findOneAndUpdate(
    { id: 'lastScrape' },
    { $set: { lastScrapeTime: new Date() } },
  );
}

export async function loader() {
  // const result = await scrape();
  // console.log(result);

  const db = mongodb.db('db');
  const collection = db.collection('test');
  const lastScrapeDoc = await collection.findOne({ id: 'lastScrape' });
  const lastScrapeTime = lastScrapeDoc.lastScrapeTime;
  const timeDifference = (Date.now() - lastScrapeTime) / 3600000;
  if (timeDifference > 1) {
    // 1 hour
    scrapeAndSave();
  }

  const theHill = await collection.findOne({ id: 'theHill' });
  const nateSilver = await collection.findOne({ id: 'nateSilver' });

  const forecasts = {
    theHill,
    nateSilver,
  };

  return { forecasts, lastScrapeTime };
}

function ForecastCard({ forecast }) {
  const demColor = 'bg-blue-400';
  const repColor = 'bg-red-400';

  return (
    <a href={forecast.url}>
      <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
        <h2 className="text-xl">{forecast.formattedName}</h2>
        <div
          className={`text-2xl font-semibold ${!forecast.percentage ? 'opacity-70' : ''}`}
        >
          {forecast.percentage ? `${forecast.percentage}%` : `(paywalled)`}
        </div>
        <div
          className={`-skew-y-2 ${forecast.outcome === 'republican' ? repColor : demColor}`}
        >
          {forecast.outcome === 'republican' ? 'Trump' : 'Biden'}
        </div>
      </div>
    </a>
  );
}

export default function Index() {
  const { forecasts, lastScrapeTime } = useLoaderData();

  const lastUpdate = formatDistanceToNow(new Date(lastScrapeTime));

  const lastUpdateWasOverAnHourAgo =
    Date.now() - new Date(lastScrapeTime) > 3600000;
  console.log(lastUpdateWasOverAnHourAgo);

  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-3xl">Presidential forecast aggregator</h1>
      </div>
      <main className="grid space-y-6 sm:grid-flow-col sm:space-x-6 sm:space-y-0">
        <ForecastCard forecast={forecasts.theHill} />
        <ForecastCard forecast={forecasts.nateSilver} />
      </main>
      <footer className="text-gray-600">
        Last update: {lastUpdate} ago
        {lastUpdateWasOverAnHourAgo && ' Refresh for the latest data.'}
      </footer>
    </>
  );
}
