import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

// Read .env.local if present
let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
  if (match) uri = match[1];
}

if (!uri) {
  uri = "mongodb+srv://wtdesigner3_db_user:CWTYA3XHu6918Wn2@soundnestcluster.o0ngm0i.mongodb.net/soundnest?retryWrites=true&w=majority";
}

const { servicesData } = await import('../src/data/servicesData.js');

async function seedServices() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    const db = client.db('soundnest');
    const collection = db.collection('services');

    console.log(`Upserting ${servicesData.length} core services...`);

    for (const service of servicesData) {
      await collection.updateOne(
        { slug: service.slug },
        {
          $set: {
            ...service,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log(`✓ Upserted service: ${service.slug}`);
    }

    const count = await collection.countDocuments();
    console.log(`Total services in collection: ${count}`);
  } catch (err) {
    console.error('Error seeding services:', err);
  } finally {
    await client.close();
  }
}

seedServices();
