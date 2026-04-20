import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("MONGODB_URI missing in .env file");
}

console.log("Attempting to connect to MongoDB...");

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});

const clientPromise = client.connect()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    return client;
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  });

export default clientPromise;