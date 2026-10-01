import dns from 'dns';

// Ensure reliable SRV record resolution across network environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

let clientPromise = null;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  try {
    const { MongoClient } = await import('mongodb');
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'soundnest');
    return { client, db };
  } catch (error) {
    console.warn("MongoDB connection warning:", error.message);
    return null;
  }
}

export async function getDb() {
  const conn = await connectToDatabase();
  return conn ? conn.db : null;
}

