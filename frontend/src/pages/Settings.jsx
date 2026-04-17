import React, { useState, useEffect } from 'react';
import { User, Image as ImageIcon, Palette, Bell, Target, Shield, Save, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import '../styles/Settings.css';

const Settings = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        university: '',
        profilePicture: ''
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        accentColor: '#3b82f6',
        enableAnimations: true,
        pomodoroDuration: 25,
        breakDuration: 5,
        dailyGoal: 5,
        weeklyTarget: 30,
        notifications: {
            email: true,
            deadlines: true,
            reports: false,
            studySessions: true
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await userService.getProfile();
                if (res.success) {
                    const u = res.data;
                    setFormData({
                        name: u.name || '',
                        email: u.email || '',
                        bio: u.bio || '',
                        university: u.university || '',
                        profilePicture: u.profilePicture || ''
                    });
                    if (u.preferences) {
                        setPreferences(prev => ({
                            ...prev,
                            ...u.preferences
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchUserData();
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePrefChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value });
    };

    const handleNotifToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleToggleAnimation = () => {
        setPreferences(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.updateProfile({ 
                ...formData,
                preferences
            });
            showMessage('Settings saved successfully!');
            
        } catch (error) {
            showMessage(error.response?.data?.error || 'Failed to save settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetStats = async () => {
        if(window.confirm('Are you sure you want to reset all your productivity statistics? This cannot be undone.')) {
            try {
                await userService.resetStats();
                showMessage('Productivity stats reset successfully');
            } catch (err) {
                showMessage('Failed to reset stats', 'error');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if(window.confirm('DANGER: Intergalactic self-destruct sequence initiated! Are you absolutely sure you want to delete your account? All tasks and data will be lost forever.')) {
            try {
                await userService.deleteAccount();
                logout();
            } catch (err) {
                showMessage('Failed to delete account', 'error');
            }
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="settings-page animate-fade-in">
            <div className="settings-content settings-container">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account preferences and customize your workspace.</p>
                </header>

                {message.text && (
                    <div className={`settings-message ${message.type === 'error' ? 'error' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                <div className="settings-grid">
                    <aside className="settings-tabs glass-card settings-tabs-container">
                        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <User size={18} /> Public Profile
                        </button>
                        <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                            <Bell size={18} /> Notifications
                        </button>
                        <button className={`tab-btn ${activeTab === 'productivity' ? 'active' : ''}`} onClick={() => setActiveTab('productivity')}>
                            <Target size={18} /> Productivity
                        </button>
                        <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                            <Shield size={18} /> Data & Security
                        </button>
                    </aside>

                    <div className="settings-content">
                        {/* PROFILE SECTION */}
                        <section className={activeTab === 'profile' ? 'active' : ''}>
                            <form onSubmit={handleSaveProfile} className="glass-card settings-card">
                                <h2><User size={20} /> Edit Profile</h2>
                                
                                <div className="avatar-upload">
                                    {formData.profilePicture ? (
                                        <img src={formData.profilePicture} alt="Profile" className="avatar-preview" />
                                    ) : (
                                        <div className="avatar-placeholder"><User size={40} /></div>
                                    )}
                                    <div className="avatar-input-group">
                                        <label className="form-label">Profile Image URL</label>
                                        <input type="text" className="form-control" name="profilePicture" value={formData.profilePicture} onChange={handleProfileChange} placeholder="https://example.com/photo.jpg" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleProfileChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleProfileChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">University / Department</label>
                                    <input type="text" className="form-control" name="university" value={formData.university} onChange={handleProfileChange} placeholder="e.g. Stanford University" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" name="bio" value={formData.bio} onChange={handleProfileChange} rows="3" placeholder="Tell us about yourself..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary settings-save-btn" disabled={loading}>
                                    <Save size={18} /> {loading ? 'Saving...' : 'Save Profile Changes'}
                                </button>
                            </form>
                        </section>


                        {/* NOTIFICATIONS SECTION */}
                        <section className={activeTab === 'notifications' ? 'active' : ''}>
                            <div className="glass-card settings-card">
                                <h2><Bell size={20} /> Notification Preferences</h2>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive weekly summary and important updates via email</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={preferences.notifications.email} onChange={() => handleNotifToggle('email')} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Task Deadline Reminders</h4>
                                        <p>Get alerted when tasks are approaching their due date</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={preferences.notifications.deadlines} onChange={() => handleNotifToggle('deadlines')} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Productivity Reports</h4>
                                        <p>Daily productivity score updates</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={preferences.notifications.reports} onChange={() => handleNotifToggle('reports')} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Study Session Alerts</h4>
                                        <p>Chime when Pomodoro timer completes</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={preferences.notifications.studySessions} onChange={() => handleNotifToggle('studySessions')} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <button onClick={handleSaveProfile} className="btn btn-primary settings-save-btn">
                                    <Save size={18} /> Save Notifications
                                </button>
                            </div>
                        </section>

                        {/* PRODUCTIVITY SECTION */}
                        <section className={activeTab === 'productivity' ? 'active' : ''}>
                            <div className="glass-card settings-card">
                                <h2><Target size={20} /> Productivity Goals</h2>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Pomodoro Duration (mins)</label>
                                        <input type="number" className="form-control" name="pomodoroDuration" value={preferences.pomodoroDuration} onChange={handlePrefChange} min="5" max="60" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Short Break (mins)</label>
                                        <input type="number" className="form-control" name="breakDuration" value={preferences.breakDuration} onChange={handlePrefChange} min="1" max="30" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Daily Task Goal</label>
                                        <input type="number" className="form-control" name="dailyGoal" value={preferences.dailyGoal} onChange={handlePrefChange} min="1" max="50" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Weekly Productivity Target</label>
                                        <input type="number" className="form-control" name="weeklyTarget" value={preferences.weeklyTarget} onChange={handlePrefChange} min="5" max="150" />
                                    </div>
                                </div>

                                <button onClick={handleSaveProfile} className="btn btn-primary settings-save-btn">
                                    <Save size={18} /> Save Goals
                                </button>
                            </div>
                        </section>

                        {/* SECURITY SECTION */}
                        <section className={activeTab === 'security' ? 'active' : ''}>
                            <div className="glass-card settings-card">
                                <h2><Shield size={20} /> Data & Security</h2>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Reset Productivity Stats</h4>
                                        <p>Clear all historic data and start fresh.</p>
                                    </div>
                                    <button className="btn settings-reset-btn" onClick={handleResetStats}>
                                        <RefreshCw size={16} /> Reset Data
                                    </button>
                                </div>

                                <div className="setting-item settings-danger-zone">
                                    <div className="setting-info">
                                        <h4 className="settings-danger-title">Danger Zone</h4>
                                        <p>Permanently delete your account and all associated data.</p>
                                    </div>
                                    <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                        <Trash2 size={16} /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
