import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Global cache to prevent multiple connections in development
let cached = global.mongoose || { conn: null, promise: null };

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error("Database connection failed");
  }

  return cached.conn;
};

if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}

export default dbConnect;
