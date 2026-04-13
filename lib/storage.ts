"use client";

import { openDB } from "idb";
import { seedData } from "@/lib/seed-data";
import { AppData } from "@/lib/types";

const DB_NAME = "pulseflow_db";
const STORE = "app";
const KEY = "state";
const VERSION = 1;

const fallbackKey = "pulseflow_local_data";

const getDb = async () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });

export async function migrateData(raw: AppData | null): Promise<AppData> {
  if (!raw) return seedData;
  if (!raw.version || raw.version < VERSION) {
    return { ...seedData, ...raw, version: VERSION };
  }

  return raw;
}

export async function getData(): Promise<AppData> {
  try {
    const db = await getDb();
    const data = (await db.get(STORE, KEY)) as AppData | undefined;
    return migrateData(data ?? null);
  } catch {
    if (typeof window === "undefined") return seedData;
    const raw = localStorage.getItem(fallbackKey);
    return migrateData(raw ? (JSON.parse(raw) as AppData) : null);
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE, data, KEY);
  } catch {
    if (typeof window !== "undefined") {
      localStorage.setItem(fallbackKey, JSON.stringify(data));
    }
  }
}
