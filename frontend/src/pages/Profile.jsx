import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import taskService from '../services/taskService';
import productivityService from '../services/productivityService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, CheckCircle, BarChart2, Edit3, Image as ImageIcon, Book, GraduationCap, Users, BookOpen, Clock, Sparkles, Shield } from 'lucide-react';
import AchievementBoard from '../components/AchievementBoard';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const Profile = () => {
    const { user: authUser } = useAuth();
    const role = authUser?.role || 'student';
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ 
        totalTasks: 0, 
        completedTasks: 0, 
        score: 0,
        totalBatches: 0,
        totalStudents: 0,
        upcomingClasses: 0,
        totalAssignments: 0
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePicture: '',
        university: '',
        department: '',
        yearOfStudy: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profRes = await userService.getProfile();
                const userData = profRes.data || profRes;
                setProfile(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '',
                    profilePicture: userData.profilePicture || '',
                    university: userData.university || '',
                    department: userData.department || '',
                    yearOfStudy: userData.yearOfStudy || '',
                    bio: userData.bio || ''
                });

                if (role === 'teacher') {
                    const analyticsRes = await batchService.getTeacherAnalytics();
                    const analytics = analyticsRes.data || analyticsRes;
                    setStats({
                        totalBatches: analytics.totalBatches || 0,
                        totalStudents: analytics.totalStudents || 0,
                        upcomingClasses: analytics.upcomingClasses || 0,
                        totalAssignments: analytics.totalAssignments || 0
                    });
                } else {
                    const [taskRes, prodRes] = await Promise.all([
                        taskService.getTasks(),
                        productivityService.getTodayProductivity()
                    ]);
                    const tasks = taskRes.data || [];
                    const completed = tasks.filter(t => t.status === 'Completed').length;
                    setStats({
                        totalTasks: tasks.length,
                        completedTasks: completed,
                        score: prodRes.data?.productivityScore || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                profilePicture: formData.profilePicture,
                university: formData.university,
                department: formData.department,
                yearOfStudy: formData.yearOfStudy,
                bio: formData.bio
            };
            if (formData.password) updateData.password = formData.password;

            const res = await userService.updateProfile(updateData);
            setProfile(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Synchronizing identity..." /></div>;

    const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Identity <GradientText>Matrix</GradientText>
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your centralized academic core and achievements.</p>
                    </div>
                    <NeonBadge color="primary" style={{ padding: '8px 16px', letterSpacing: '2px' }}>
                        {role.toUpperCase()} LEVEL 1
                    </NeonBadge>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    {/* LEFT: CORE IDENTITY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <GlassCard style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border-glass-bright)' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                                <div style={{ position: 'absolute', inset: '-8px', border: '2px solid var(--primary)', borderRadius: '50%', opacity: 0.3 }}></div>
                                <div style={{ position: 'absolute', inset: '-12px', border: '1px dashed var(--secondary)', borderRadius: '50%', opacity: 0.2 }}></div>
                                {profile?.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white' }}>
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{profile?.name}</h2>
                            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1.5rem' }}>
                                {role === 'teacher' ? 'CORE EDUCATOR' : (profile?.department || 'UNIT OPERATIVE')}
                            </p>
                            {profile?.bio && (
                                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '2rem' }}>
                                    "{profile.bio}"
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                                <div style={styles.infoRow}><Mail size={16} color="var(--primary)" /> {profile?.email}</div>
                                <div style={styles.infoRow}><GraduationCap size={16} color="var(--primary)" /> {profile?.university || 'Unspecified Hub'}</div>
                                <div style={styles.infoRow}><Calendar size={16} color="var(--primary)" /> JOINED: {new Date(profile?.createdAt).toLocaleDateString()}</div>
                            </div>
                        </GlassCard>

                        {role === 'student' && (
                            <GlassCard style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <Sparkles size={18} color="var(--secondary)" /> Achievement Archive
                                </h3>
                                <AchievementBoard completedTasks={stats.completedTasks} earnedBadges={profile?.badges || []} />
                            </GlassCard>
                        )}
                    </div>

                    {/* RIGHT: SYSTEMS CONFIG */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                            {role === 'teacher' ? (
                                <>
                                    <GlassMetric icon={<Users size={20} />} label="ACTIVE COHORTS" value={stats.totalBatches} color="var(--primary)" />
                                    <GlassMetric icon={<Users size={20} />} label="UNITS MANAGED" value={stats.totalStudents} color="#22c55e" />
                                    <GlassMetric icon={<Clock size={20} />} label="SESSION LOAD" value={stats.upcomingClasses} color="#eab308" />
                                </>
                            ) : (
                                <>
                                    <GlassMetric icon={<CheckCircle size={20} />} label="GOALS COMPLETED" value={stats.completedTasks} color="#22c55e" />
                                    <GlassMetric icon={<BarChart2 size={20} />} label="SYSTEM LOAD" value={stats.totalTasks} color="#eab308" />
                                    <GlassMetric icon={<Activity size={20} />} label="CORE VELOCITY" value={`${stats.score}%`} color="var(--primary)" />
                                </>
                            )}
                        </div>

                        <GlassCard style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>System Parameters</h2>
                                <GlowButton 
                                    variant={isEditing ? 'secondary' : 'primary'} 
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{ fontSize: '0.8rem', padding: '6px 16px' }}
                                >
                                    <Edit3 size={16} /> {isEditing ? 'ABORT' : 'MODIFY'}
                                </GlowButton>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">IDENTITY NAME</label>
                                            <Input type="text" name="name" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.name} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">IDENTITY EMAIL</label>
                                            <Input type="email" name="email" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.email} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">PROFILE BIO (SPECIFICATIONS)</label>
                                        <Input as="textarea" name="bio" rows="2" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.bio} onChange={handleInputChange} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">INSTITUTIONAL HUB</label>
                                            <Input type="text" name="university" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.university} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">DEPARTMENT / DOMAIN</label>
                                            <Input type="text" name="department" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.department} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">AVATAR DATA URL</label>
                                        <Input type="text" name="profilePicture" style={{ background: 'rgba(255,255,255,0.01)' }} value={formData.profilePicture} onChange={handleInputChange} />
                                    </div>
                                    <GlowButton type="submit" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                        COMMIT TO DATABASE
                                    </GlowButton>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.3 }}>
                                    <Shield size={64} style={{ marginBottom: '1.5rem' }} />
                                    <h3 style={{ fontWeight: 800 }}>CORE ARCHIVE ENCRYPTED</h3>
                                    <p style={{ fontSize: '0.9rem' }}>Initialize Modify Sequence to update identity parameters.</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GlassMetric = ({ icon, label, value, color }) => (
    <GlassCard style={{ padding: '1.5rem', borderLeft: `3px solid ${color}` }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</div>
    </GlassCard>
);

const styles = {
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        background: 'rgba(255,255,255,0.02)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border-glass)'
    }
};

export default Profile;
