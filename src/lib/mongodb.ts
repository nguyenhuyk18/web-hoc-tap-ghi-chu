import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("Thiếu biến môi trường MONGODB_URI");
}

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cache;

export async function connectMongoDB() {
  if (cache.connection) return cache.connection;

  cache.promise ??= mongoose.connect(MONGODB_URI, {
    dbName: "network_knowledge",
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    maxPoolSize: 10,
  });

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}
