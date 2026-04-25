"use strict";
//lib/db.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = getDB;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new mongodb_1.MongoClient(uri);
const clientPromise = client.connect();
async function getDB() {
    const client = await clientPromise;
    return client.db("automized-informig-by-email-global-lingua");
}
