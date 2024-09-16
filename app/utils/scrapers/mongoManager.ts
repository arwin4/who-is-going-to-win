import mongoose from 'mongoose';
import { Prediction, Source } from '~/types';

let collection: mongoose.Collection<mongoose.AnyObject>;

export async function connectToMongoDB() {
  const connectionString = process.env.CONNECTION_STRING || '';
  await mongoose.connect(connectionString);
  collection = mongoose.connection.collection('test');
}

export async function disconnectMongoDB() {
  await mongoose.disconnect();
}

export async function findForecast(source: Source) {
  return collection.findOne({ id: source });
}

export async function updatePredictionInMongoDB(
  prediction: Prediction,
  source: Source,
) {
  try {
    await collection.findOneAndUpdate(
      { id: source },
      {
        $set: {
          outcome: prediction.outcome,
          demPercentage: prediction.demPercentage,
          repPercentage: prediction.repPercentage,
          lastUpdate: new Date(),
        },
      },
    );
  } catch (err) {
    console.error(`Unable to update db with new ${source} data`);
  }
}
