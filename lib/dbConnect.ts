import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached?.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log("Creating new database connection");
    cached = global.mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("Database connected successfully");
        return mongoose;
      }),
    };
  }

  try {
    const conn = await cached.promise;
    cached.conn = conn;
  } catch (e) {
    cached.promise = null;
    console.error("Database connection error:", e);
    throw e;
  }

  // Ensure all models are registered
  require("@/models/User");
  require("@/models/Class");
  require("@/models/Branch");
  require("@/models/Course");
  require("@/models/Grade");
  require("@/models/Event");
  require("@/models/Assignment");
  require("@/models/StudentPoint");

  return cached.conn!;
}

export default dbConnect;
