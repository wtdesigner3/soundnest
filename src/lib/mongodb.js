// MongoDB connection utility for dynamic lead storage and CMS data
let clientPromise = null;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Graceful fallback when MongoDB URI is not configured yet
    return null;
  }

  try {
    const { MongoClient } = await import('mongodb');
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {});
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'soundnest');
    return { client, db };
  } catch (error) {
    console.warn("MongoDB connection failed or mongodb package not yet installed:", error.message);
    return null;
  }
}
