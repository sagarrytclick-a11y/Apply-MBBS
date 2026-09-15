import mongoose from "mongoose";

const DEFAULT_DB = "applymbbs";

/**
 * Atlas URI without a path (…mongodb.net/?appName=…) makes mongoose use the
 * "test" database — enquiries then won't show up where you expect.
 */
function resolveMongoUri(raw: string): string {
  const uri = raw.trim();
  if (!uri) return uri;

  try {
    const parsed = new URL(uri);
    const path = parsed.pathname.replace(/^\//, "");
    if (!path) {
      parsed.pathname = `/${DEFAULT_DB}`;
      return parsed.toString();
    }
    return uri;
  } catch {
    // Fallback for unusual URI shapes
    if (/mongodb(\+srv)?:\/\/[^/]+\/(\?|$)/.test(uri)) {
      return uri.replace(/\/(\?|$)/, `/${DEFAULT_DB}$1`);
    }
    return uri;
  }
}

const MONGODB_URI = resolveMongoUri(
  process.env.MONGODB_URI || `mongodb://localhost:27017/${DEFAULT_DB}`
);

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

const cached: Cached = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: DEFAULT_DB,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
