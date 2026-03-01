import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Activity, Thermometer, Zap, Settings, Cpu } from 'lucide-react';
import './index.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="logo">
                <Cpu className="logo-icon" size={32} />
                <h2>Braiins OS Manager</h2>
            </div>
            <nav>
                <Link to="/" className="nav-item active">
                    <Activity size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/settings" className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>
        </div>
    );
}

function Dashboard() {
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
                        <p>275.7 TH/s</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">
                        <Zap />
                    </div>
                    <div className="stat-details">
                        <h3>Current Power</h3>
                        <p>6250 W</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">
                        <Thermometer />
                    </div>
                    <div className="stat-details">
                        <h3>Avg Temp</h3>
                        <p>80 °C</p>
                    </div>
                </div>
            </div>

            <div className="miners-section">
                <h2>Active Miners</h2>
                <div className="miner-grid">
                    <div className="miner-card status-normal">
                        <div className="miner-header">
                            <h3>Antminer S19J Pro</h3>
                            <span className="status-badge">Normal</span>
                        </div>
                        <div className="miner-body">
                            <div className="miner-stat"><span>IP:</span> 192.168.1.101</div>
                            <div className="miner-stat"><span>Hashrate:</span> 140.5 TH/s</div>
                            <div className="miner-stat"><span>Temp:</span> 75 °C</div>
                        </div>
                        <div className="miner-footer">
                            <button className="btn-secondary">Manage</button>
                        </div>
                    </div>
                    <div className="miner-card status-warning">
                        <div className="miner-header">
                            <h3>Antminer S19 Pro</h3>
                            <span className="status-badge warning">Warning</span>
                        </div>
                        <div className="miner-body">
                            <div className="miner-stat"><span>IP:</span> 192.168.1.102</div>
                            <div className="miner-stat"><span>Hashrate:</span> 135.2 TH/s</div>
                            <div className="miner-stat"><span>Temp:</span> 85 °C</div>
                        </div>
                        <div className="miner-footer">
                            <button className="btn-secondary">Manage</button>
                        </div>
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
                        <Route path="/settings" element={<div>Settings Page Stub</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
