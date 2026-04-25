import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in .env file");
    console.log("\nPlease add to your .env file:");
    console.log('MONGODB_URI=mongodb+srv://global-lingua:ejPAUZnQ70Tef9dH@cluster0.opd13hk.mongodb.net/?appName=Cluster0');
    return;
  }
  
  console.log("🔗 Testing connection to MongoDB Atlas...");
  console.log(`URI: ${uri.replace(/\/\/.*@/, '//****:****@')}`); // Hide password
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully!");
    
    const db = client.db("admin");
    const result = await db.command({ ping: 1 });
    console.log("✅ Database ping successful:", result);
    
    await client.close();
    console.log("✅ Connection closed");
  } catch (error: any) {
    console.error("❌ Connection failed:", error.message);
    console.error("\n💡 Possible solutions:");
    console.error("1. Check if your IP is whitelisted in MongoDB Atlas");
    console.error("2. Verify username/password are correct");
    console.error("3. Check if you're behind a corporate firewall");
    console.error("4. Try using a VPN or different network");
  }
}

// Run the test
testConnection();