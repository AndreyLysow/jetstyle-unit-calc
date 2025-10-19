import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
        uri: string | null;
      }
    | undefined;
}

/** Собираем итоговый Mongo URI корректно, учитывая ?query */
function makeUri() {
  const raw = process.env.MONGODB_URI;
  if (!raw) throw new Error("Missing MONGODB_URI");

  const dbName = (process.env.MONGODB_DB || "unitcalc").trim();

  // Разделяем на base и query (включая ведущий '?')
  const qPos = raw.indexOf("?");
  const base = qPos === -1 ? raw : raw.slice(0, qPos);
  const query = qPos === -1 ? "" : raw.slice(qPos); // '' или строка с '?...'

  // Уже есть БД в конце base? (…/dbname)
  const hasDbInBase = /\/[^/]+$/.test(base) && !base.endsWith("/");

  if (hasDbInBase) {
    // URI уже содержит БД — возвращаем исходный (с query)
    return raw;
  }

  // Добавляем /<db> строго до query
  const baseNoSlash = base.replace(/\/$/, "");
  return `${baseNoSlash}/${dbName}${query}`;
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

export async function dbDisconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  global._mongoose = { conn: null, promise: null, uri: FINAL_URI };
}

/** Текущая нативная DB (MongoDB.Db) */
export function getDb() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return db;
}