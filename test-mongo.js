const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI:', uri.replace(/global-lingua:[^@]*@/, 'global-lingua:****@'));

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('automized-informig-by-email-global-lingua');
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();