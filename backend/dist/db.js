"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
async function initDb() {
    const db = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, '../data/miners.sqlite'),
        driver: sqlite3_1.default.Database
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
