import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function initDb() {
    const db = await open({
        filename: path.join(__dirname, '../data/miners.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS miners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ip TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

    return db;
}
