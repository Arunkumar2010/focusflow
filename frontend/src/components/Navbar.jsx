import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Sun, Moon, Activity, Zap } from 'lucide-react';
import { GradientText } from './ui/FuturisticUI';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-panel" style={{ 
            margin: '1rem', 
            borderRadius: '20px', 
            position: 'sticky', 
            top: '1rem', 
            width: 'calc(100% - 2rem)',
            zIndex: 1000
        }}>
            <div className="brand-group" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div className="logo-container">
                    <div style={{ background: 'var(--accent-gradient)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                        <Zap size={20} color="white" />
                    </div>
                    <h2 className="logo" style={{ fontWeight: 800 }}>FocusFlow</h2>
                </div>
            </div>

            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {!user && <Link to="/login" className="nav-link">Login</Link>}
                {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
            </div>

            <div className="user-section">
                <button onClick={toggleTheme} className="theme-btn" title="Toggle System Theme">
                    {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
                </button>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="user-info" style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                            <User size={16} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-logout-icon" title="Terminate Session">
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
