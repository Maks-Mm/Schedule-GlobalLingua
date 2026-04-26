"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = getDB;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI missing");
}
const client = new mongodb_1.MongoClient(uri);
const clientPromise = client.connect();
async function getDB() {
    const client = await clientPromise;
    // Use the default database or specify one
    return client.db("global-lingua"); // or whatever you want to name your database
}
exports.default = clientPromise;
