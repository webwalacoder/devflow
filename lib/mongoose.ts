import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";

// Load connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

// Throw error early if no URI is set
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Cache interface to store connection and pending promise
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend Node global to persist cache across module reloads (Next.js dev mode)
declare global {
  var mongoose: MongooseCache;
}

// Initialize global cache if not already present
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB
const dbConnect = async (): Promise<Mongoose> => {
  // Return existing connection if already established
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  // Create a connection promise if none exists
  // Ensures multiple requests share the same connection attempt
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow", // Use specific database
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        throw error;
      });
  }

  // Await the connection promise and store the connection in cache
  // Ensures future calls reuse the same connection
  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
