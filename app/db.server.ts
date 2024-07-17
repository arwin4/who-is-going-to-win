import { MongoClient } from 'mongodb';

let connectionString = process.env.CONNECTION_STRING || '';

if (connectionString.indexOf('appName') === -1)
  connectionString +=
    connectionString.indexOf('?') > -1
      ? '&appName=devrel.template.remix|'
      : '?appName=devrel.template.remix|';
else
  connectionString = connectionString.replace(
    /appName=([a-z0-9]*)/i,
    (m, p) => `appName=devrel.template.remix|${p}`,
  );

console.log('Connecting to MongoDB...');
const mongodb = new MongoClient(connectionString);

export { mongodb };
