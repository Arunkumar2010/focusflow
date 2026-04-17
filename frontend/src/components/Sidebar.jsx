import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, TrendingUp, Clock, UserCircle, Settings, Users, Video, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="menu-list">
                <NavLink 
                    to="/" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><LayoutDashboard size={20} /></span>
                    Dashboard
                </NavLink>

                <NavLink 
                    to="/tasks" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><CheckSquare size={20} /></span>
                    My Tasks
                </NavLink>

                <NavLink 
                    to="/batches" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><Users size={20} /></span>
                    My Batches
                </NavLink>

                <NavLink 
                    to="/classes" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><Video size={20} /></span>
                    Live Classes
                </NavLink>

                {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <NavLink 
                        to="/schedule-class" 
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon-wrapper"><Clock size={20} /></span>
                        Schedule Class
                    </NavLink>
                )}

                <NavLink 
                    to="/assignments" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><FileText size={20} /></span>
                    Assignments
                </NavLink>

                <NavLink 
                    to="/productivity" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><TrendingUp size={20} /></span>
                    Productivity
                </NavLink>

                <NavLink 
                    to="/timer" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><Clock size={20} /></span>
                    Study Timer
                </NavLink>

                <NavLink 
                    to="/profile" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><UserCircle size={20} /></span>
                    Profile
                </NavLink>

                <NavLink 
                    to="/settings" 
                    className="sidebar-link"
                >
                    <span className="sidebar-icon-wrapper"><Settings size={20} /></span>
                    Settings
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
