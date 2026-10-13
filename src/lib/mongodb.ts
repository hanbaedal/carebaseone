import { MongoClient, type Collection, type Document } from "mongodb";

const databaseName = "carebaseone";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client = globalForMongo.mongoClient ?? new MongoClient(uri);
  globalForMongo.mongoClient = client;

  await client.connect();
  return client.db(databaseName).collection<T>(name);
}
