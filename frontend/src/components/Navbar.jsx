import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Sun, Moon, Activity } from 'lucide-react';
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
            <div className="brand-group">
                <div className="logo-container">
                    <Activity size={28} color="var(--accent-color)" />
                    <h2 className="logo">FocusFlow</h2>
                </div>
                <p className="tagline">Manage Tasks. Track Productivity. Achieve More.</p>
            </div>
            <div className="user-section">
                <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} color="var(--warning-color)" /> : <Moon size={20} color="var(--text-secondary)" />}
                </button>
                {user && (
                    <>
                        <div className="user-info">
                            <User size={18} />
                            <span>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-danger logout-btn">
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
