import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Sun, Moon, Zap } from 'lucide-react';
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
        <nav className="navbar">
            <div className="brand-group" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div className="logo-container">
                    <div style={{ background: 'var(--accent-gradient)', padding: '5px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                        <Zap size={18} color="white" />
                    </div>
                    <h2 className="logo">FocusFlow</h2>
                </div>
            </div>

            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {!user && <Link to="/login" className="nav-link">Login</Link>}
                {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
                {user && <Link to="/tasks" className="nav-link">Tasks</Link>}
            </div>

            <div className="user-section">
                <button onClick={toggleTheme} className="theme-btn" title="Toggle System Theme">
                    {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#64748b" />}
                </button>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="user-info-pill">
                            <User size={14} style={{ color: 'var(--primary)' }} />
                            <span>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-logout-icon" title="Terminate Session">
                            <LogOut size={16} />
                        </button>
                    </div>
                )}
                {!user && (
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                       <button className="nav-link" style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                         Join 🚀
                       </button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
