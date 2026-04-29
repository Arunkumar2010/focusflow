import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, TrendingUp, Clock, UserCircle, Settings, Users, Video, FileText, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="sidebar glass-panel" style={{ 
            margin: '0 1rem 1rem 1rem', 
            borderRadius: '24px', 
            height: 'calc(100vh - 8rem)', 
            position: 'sticky', 
            top: '7rem',
            width: '260px',
            padding: '1.5rem'
        }}>
            <div className="sidebar-header" style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px' }}>CORE SYSTEMS</span>
            </div>
            
            <div className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Command Center" />
                <SidebarItem to="/tasks" icon={<CheckSquare size={20} />} label="Task Engine" />
                <SidebarItem to="/batches" icon={<Users size={20} />} label="User Batches" />
                <SidebarItem to="/classes" icon={<Video size={20} />} label="Live Sessions" />

                {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <SidebarItem to="/schedule-class" icon={<Clock size={20} />} label="Class Dispatch" />
                )}

                <SidebarItem to="/assignments" icon={<FileText size={20} />} label="Knowledge Vault" />
                <SidebarItem to="/productivity" icon={<TrendingUp size={20} />} label="Performance" />
                <SidebarItem to="/timer" icon={<Zap size={20} />} label="Focus Mode" />
                
                <div style={{ margin: '1.5rem 0 1rem', padding: '0 0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '2px' }}>CONFIGURATION</span>
                </div>
                
                <SidebarItem to="/profile" icon={<UserCircle size={20} />} label="Identity" />
                <SidebarItem to="/settings" icon={<Settings size={20} />} label="System Config" />
            </div>
        </aside>
    );
};

const SidebarItem = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            textDecoration: 'none',
            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
            background: isActive ? 'rgba(57, 209, 220, 0.1)' : 'transparent',
            border: isActive ? '1px solid rgba(57, 209, 220, 0.2)' : '1px solid transparent',
            transition: 'var(--transition-smooth)',
            fontWeight: isActive ? 700 : 500,
            fontSize: '0.95rem'
        })}
    >
        <span style={{ display: 'flex', color: 'inherit' }}>{icon}</span>
        {label}
    </NavLink>
);

export default Sidebar;
