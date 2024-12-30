import mongoose from 'mongoose'

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached = global.mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        // Ensure all models are registered after connection
        require("@/models/User");
        require("@/models/Class");
        require("@/models/Branch");
        require("@/models/Course");
        // Add any other models here
        return mongoose
      })
    }
  }

  try {
    const conn = await cached.promise
    cached.conn = conn
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn!
}

export default dbConnect

