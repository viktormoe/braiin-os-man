"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let db;
// Initialize DB and start server
async function start() {
    db = await (0, db_1.initDb)();
    app.listen(port, () => {
        console.log(`Backend proxy listening on port ${port}`);
    });
}
// Get all configured miners
app.get('/api/miners/config', async (req, res) => {
    try {
        const miners = await db.all('SELECT id, name, ip, username FROM miners');
        res.json(miners);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch miners' });
    }
});
// Add a new miner
app.post('/api/miners/config', async (req, res) => {
    const { name, ip, username, password } = req.body;
    if (!name || !ip || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = await db.run('INSERT INTO miners (name, ip, username, password) VALUES (?, ?, ?, ?)', [name, ip, username, password]);
        res.json({ id: result.lastID, name, ip, username });
    }
    catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Miner with this IP already exists' });
        }
        res.status(500).json({ error: 'Failed to add miner' });
    }
});
// Delete a miner
app.delete('/api/miners/config/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM miners WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete miner' });
    }
});
// Mock endpoint for fetching live status (Will be replaced with actual Braiins API calls later)
app.get('/api/miners', async (req, res) => {
    try {
        const configuredMiners = await db.all('SELECT id, name, ip FROM miners');
        // Stub out live data for each configured miner
        const liveData = configuredMiners.map((m) => ({
            id: m.id,
            ip: m.ip,
            name: m.name,
            status: 'normal',
            hashrate: 140.0 + (Math.random() * 5),
            temp: 75 + Math.floor(Math.random() * 10),
            power: 3100
        }));
        res.json(liveData);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch live stats' });
    }
});
start();
