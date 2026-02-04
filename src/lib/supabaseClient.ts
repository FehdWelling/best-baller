import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SQLite from "expo-sqlite";

type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

const database = SQLite.openDatabase("supabase.db");

const initializeStorage = (): Promise<void> =>
  new Promise((resolve, reject) => {
    database.transaction((transaction) => {
      transaction.executeSql(
        "CREATE TABLE IF NOT EXISTS supabase_kv (key TEXT PRIMARY KEY NOT NULL, value TEXT);",
        [],
        () => resolve(),
        (_transaction, error) => {
          reject(error);
          return false;
        },
      );
    });
  });

const storageReady = initializeStorage();

const storage: AuthStorage = {
  getItem: async (key) => {
    await storageReady;
    return new Promise((resolve, reject) => {
      database.transaction((transaction) => {
        transaction.executeSql(
          "SELECT value FROM supabase_kv WHERE key = ?;",
          [key],
          (_transaction, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0).value as string);
              return;
            }
            resolve(null);
          },
          (_transaction, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  },
  setItem: async (key, value) => {
    await storageReady;
    return new Promise((resolve, reject) => {
      database.transaction((transaction) => {
        transaction.executeSql(
          "INSERT OR REPLACE INTO supabase_kv (key, value) VALUES (?, ?);",
          [key, value],
          () => resolve(),
          (_transaction, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  },
  removeItem: async (key) => {
    await storageReady;
    return new Promise((resolve, reject) => {
      database.transaction((transaction) => {
        transaction.executeSql(
          "DELETE FROM supabase_kv WHERE key = ?;",
          [key],
          () => resolve(),
          (_transaction, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
