import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from 'react-router-dom';
import { mongodb } from '../db.server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const meta: MetaFunction = () => {
  return [
    { title: 'Presidential forecast aggregator' },
    { name: 'description', content: 'Presidential forecast aggregator' },
  ];
};

async function scrape() {
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
    theHill: {
      outcome: outcome,
      percentage: percentage,
    },
  };
}

export async function loader() {
  const result = await scrape();
  console.log(result);

  const db = mongodb.db('db');
  const collection = db.collection('test');
  collection.insertOne(result);

  return collection.countDocuments();
}

export default function Test() {
  const data = useLoaderData();
  return <>{data} documents in the test collection :)</>;
}
