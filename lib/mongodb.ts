import mongoose from "mongoose";

declare global {
  // делаем кэш доступным между hot-reload'ами Next.js
  // eslint-disable-next-line no-var
  var _mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
        uri: string | null;
      }
    | undefined;
}

/** Собираем финальный URI */
function makeUri() {
  const raw = process.env.MONGODB_URI;
  if (!raw) throw new Error("Missing MONGODB_URI");

  const db = (process.env.MONGODB_DB || "unitcalc").trim();
  const hasDbAtEnd = /\/[^/?]+$/.test(raw);
  if (hasDbAtEnd) return raw;

  return `${raw.replace(/\/$/, "")}/${db}`;
}

const FINAL_URI = makeUri();

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null, uri: FINAL_URI };
} else {
  global._mongoose.uri = global._mongoose.uri || FINAL_URI;
}

export async function dbConnect() {
  const cache = global._mongoose!;
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(cache.uri!, {
      bufferCommands: false,
      maxPoolSize: 5,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/** Опционально: отключение */
export async function dbDisconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  global._mongoose = { conn: null, promise: null, uri: FINAL_URI };
}

/** Возвращает текущую базу (native MongoDB Db object) */
export function getDb() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return db;
}