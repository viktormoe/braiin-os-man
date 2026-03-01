import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Thermometer, Zap, Settings, Cpu, Plus, Trash2 } from 'lucide-react';
import './index.css';

const API_BASE = 'http://localhost:3001/api';

function Sidebar() {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="logo">
                <Cpu className="logo-icon" size={32} />
                <h2>Braiins OS Manager</h2>
            </div>
            <nav>
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Activity size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>
        </div>
    );
}

function Dashboard() {
    const [miners, setMiners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/miners`)
            .then(res => res.json())
            .then(data => {
                setMiners(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const totalHashrate = miners.reduce((acc, m) => acc + (m.hashrate || 0), 0);
    const totalPower = miners.reduce((acc, m) => acc + (m.power || 0), 0);
    const avgTemp = miners.length > 0 ? (miners.reduce((acc, m) => acc + (m.temp || 0), 0) / miners.length).toFixed(1) : 0;

    if (loading) return <div className="loader">Loading farm data...</div>;

    return (
        <div className="dashboard">
            <header>
                <h1>Farm Overview</h1>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <Activity />
                    </div>
                    <div className="stat-details">
                        <h3>Total Hashrate</h3>
                        <p>{totalHashrate.toFixed(1)} TH/s</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">
                        <Zap />
                    </div>
                    <div className="stat-details">
                        <h3>Current Power</h3>
                        <p>{totalPower} W</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">
                        <Thermometer />
                    </div>
                    <div className="stat-details">
                        <h3>Avg Temp</h3>
                        <p>{avgTemp} °C</p>
                    </div>
                </div>
            </div>

            <div className="miners-section">
                <h2>Active Miners</h2>
                <div className="miner-grid">
                    {miners.map((miner) => (
                        <div key={miner.id} className={`miner-card status-${miner.status}`}>
                            <div className="miner-header">
                                <h3>{miner.name}</h3>
                                <span className={`status-badge ${miner.status !== 'normal' ? 'warning' : ''}`}>{miner.status}</span>
                            </div>
                            <div className="miner-body">
                                <div className="miner-stat"><span>IP:</span> {miner.ip}</div>
                                <div className="miner-stat"><span>Hashrate:</span> {miner.hashrate?.toFixed(1) || 0} TH/s</div>
                                <div className="miner-stat"><span>Temp:</span> {miner.temp || 0} °C</div>
                            </div>
                            <div className="miner-footer">
                                <button className="btn-secondary">Manage</button>
                            </div>
                        </div>
                    ))}
                    {miners.length === 0 && <p style={{ color: 'var(--gray-40)' }}>No miners configured. Go to Settings to add one.</p>}
                </div>
            </div>
        </div>
    );
}

function SettingsPage() {
    const [miners, setMiners] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: '', ip: '', username: '', password: '' });

    useEffect(() => {
        fetchMiners();
    }, []);

    const fetchMiners = () => {
        fetch(`${API_BASE}/miners/config`)
            .then(res => res.json())
            .then(setMiners)
            .catch(console.error);
    };

    const handleAddMiner = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API_BASE}/miners/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setFormData({ name: '', ip: '', username: '', password: '' });
        fetchMiners();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE}/miners/config/${id}`, { method: 'DELETE' });
        fetchMiners();
    };

    return (
        <div className="settings-page">
            <header>
                <h1>Farm Configuration</h1>
            </header>

            <div className="settings-container">
                <div className="card add-miner-form">
                    <h2>Add New Miner</h2>
                    <form onSubmit={handleAddMiner}>
                        <div className="form-group">
                            <label>Friendly Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Antminer S19 Pro 1" />
                        </div>
                        <div className="form-group">
                            <label>IP Address</label>
                            <input type="text" required value={formData.ip} onChange={e => setFormData({ ...formData, ip: e.target.value })} placeholder="192.168.1.x" />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="root" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-primary"><Plus size={16} /> Add Miner</button>
                    </form>
                </div>

                <div className="card configured-miners">
                    <h2>Configured Devices</h2>
                    <div className="miner-list">
                        {miners.map(m => (
                            <div key={m.id} className="list-item">
                                <div className="item-info">
                                    <strong>{m.name}</strong>
                                    <span>{m.ip}</span>
                                </div>
                                <button onClick={() => handleDelete(m.id)} className="btn-icon danger"><Trash2 size={20} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
