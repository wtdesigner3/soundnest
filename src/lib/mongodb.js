import dns from 'dns';

// Ensure reliable DNS fallback
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in restricted environments
}

const DIRECT_ATLAS_URI =
  'mongodb://wtdesigner3_db_user:CWTYA3XHu6918Wn2@ac-zs9bje9-shard-00-00.o0ngm0i.mongodb.net:27017,ac-zs9bje9-shard-00-01.o0ngm0i.mongodb.net:27017,ac-zs9bje9-shard-00-02.o0ngm0i.mongodb.net:27017/soundnest?ssl=true&replicaSet=atlas-g3ve98-shard-0&authSource=admin&retryWrites=true&w=majority';

export async function connectToDatabase() {
  let uri = process.env.MONGODB_URI;

  // If using the SRV connection that fails on Windows local DNS, auto-fallback to direct replica set
  if (!uri || uri.includes('soundnestcluster.o0ngm0i.mongodb.net')) {
    uri = DIRECT_ATLAS_URI;
  }

  try {
    const { MongoClient } = await import('mongodb');

    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      global._mongoClientPromise = client.connect();
    }

    const client = await global._mongoClientPromise;
    const db = client.db(process.env.MONGODB_DB || 'soundnest');
    return { client, db };
  } catch (error) {
    console.error('[MongoDB Error]', error.message);
    // Reset global promise on error so subsequent requests can retry
    global._mongoClientPromise = null;
    return null;
  }
}

export async function getDb() {
  const conn = await connectToDatabase();
  return conn ? conn.db : null;
}
