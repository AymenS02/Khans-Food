import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) { // fail early test
  throw new Error("Missing MONGODB_URI environment variable");
}

interface MongooseCache { // describe the shape of the cache object
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined; // allow global `mongooseCache` to be defined so we don't keep connecting and instead use our cached connection
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
}; // use the cashed connection if it exists, otherwise create a new cache object

global.mongooseCache = cached; // assign the cache object to the global variable so it can be reused across function calls

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;

  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
}