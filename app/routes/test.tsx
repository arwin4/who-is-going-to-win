import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from 'react-router-dom';
import { mongodb } from '../db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Presidential forecast aggregator' },
    { name: 'description', content: 'Presidential forecast aggregator' },
  ];
};

export async function loader() {
  const db = mongodb.db('db');
  const collection = db.collection('test');

  return collection.countDocuments();
}

export default function Test() {
  const data = useLoaderData();
  return <>{data} documents in the test collection :)</>;
}
