import mongoose from 'mongoose';

export default async function connectToMongoDB() {
  const connectionString = process.env.CONNECTION_STRING || '';

  await mongoose.connect(connectionString);

  const collection = mongoose.connection.collection('test');
}
