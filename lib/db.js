"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI missing in .env file");
}
console.log("Attempting to connect to MongoDB...");
const client = new mongodb_1.MongoClient(uri, {
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
exports.default = clientPromise;
