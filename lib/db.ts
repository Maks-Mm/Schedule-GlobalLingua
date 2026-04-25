import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI missing");
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function getDB() {
  const client = await clientPromise;
  // Use the default database or specify one
  return client.db("global-lingua"); // or whatever you want to name your database
}

export default clientPromise;