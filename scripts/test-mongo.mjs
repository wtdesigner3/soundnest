import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://wtdesigner3_db_user:CWTYA3XHu6918Wn2@soundnestcluster.o0ngm0i.mongodb.net/soundnest?retryWrites=true&w=majority";

async function testMongo() {
  console.log('Testing connection to MongoDB Atlas with Google/Cloudflare DNS...');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');
    const db = client.db('soundnest');
    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

testMongo();
