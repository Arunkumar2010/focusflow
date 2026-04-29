import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import userService from '../../services/userService';
import productivityService from '../../services/productivityService';
import batchService from '../../services/batchService';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Calendar, Edit3, GraduationCap } from 'lucide-react';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../../components/ui/FuturisticUI';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

// Modular Components
import StudentProfile from './StudentProfile';
import TeacherProfile from './TeacherProfile';

const Profile = () => {
    const { tasks, loading: tasksLoading } = useApp();
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
        name: '', email: '', password: '', profilePicture: '',
        university: '', department: '', yearOfStudy: '', bio: ''
    });

    // XP Logic: +10 per completed, +5 per created
    const calculateXP = (total, completed) => {
        return (completed * 10) + (total * 5);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profRes = await userService.getProfile();
                const userData = profRes?.data || profRes;
                setProfile(userData);
                setFormData({
                    name: userData?.name || '',
                    email: userData?.email || '',
                    password: '',
                    profilePicture: userData?.profilePicture || '',
                    university: userData?.university || '',
                    department: userData?.department || '',
                    yearOfStudy: userData?.yearOfStudy || '',
                    bio: userData?.bio || ''
                });

                if (role === 'teacher' || role === 'admin') {
                    const analyticsRes = await batchService.getTeacherAnalytics();
                    const analytics = analyticsRes?.data || analyticsRes;
                    setStats({
                        totalBatches: analytics?.totalBatches || 0,
                        totalStudents: analytics?.totalStudents || 0,
                        upcomingClasses: analytics?.upcomingClasses || 0,
                        totalAssignments: analytics?.totalAssignments || 0
                    });
                } else {
                    const prodRes = await productivityService.getTodayProductivity().catch(() => ({ data: { productivityScore: 0 } }));
                    
                    // Tasks come from GLOBAL context now
                    const total = tasks.length;
                    const completed = tasks.filter(t => t.status === 'Completed').length;
                    
                    setStats({
                        totalTasks: total,
                        completedTasks: completed,
                        score: prodRes?.data?.productivityScore || 0
                    });
                }
            } catch (error) {
                console.error("Profile sync error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [role, tasks]); // React to tasks changes

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...formData };
            if (!updateData.password) delete updateData.password;
            const res = await userService.updateProfile(updateData);
            setProfile(res?.data || res);
            setIsEditing(false);
        } catch (error) { console.error("Update failed", error); }
    };

    if (loading || tasksLoading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Synchronizing Identity Matrix..." /></div>;
    if (!profile) return null;

    const xp = calculateXP(stats.totalTasks, stats.completedTasks);

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Identity <GradientText>Matrix</GradientText>
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your centralized academic core.</p>
                    </div>
                    <NeonBadge color="primary" style={{ padding: '8px 16px', letterSpacing: '2px' }}>
                        {role.toUpperCase()}
                    </NeonBadge>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.75fr', gap: '2.5rem' }}>
                    {/* 👤 SHARED IDENTITY CARD */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <GlassCard style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border-glass-bright)' }}>
                            <div style={{ width: '110px', height: '110px', margin: '0 auto 1.5rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: '-6px', border: '2px solid var(--primary)', borderRadius: '50%', opacity: 0.3 }}></div>
                                {profile?.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
                                        {profile?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{profile?.name || 'N/A'}</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginTop: '2rem' }}>
                                <div style={styles.infoRow}><Mail size={16} color="var(--primary)" /> {profile?.email || 'N/A'}</div>
                                <div style={styles.infoRow}><GraduationCap size={16} color="var(--primary)" /> {profile?.university || 'Academic Hub'}</div>
                                <div style={styles.infoRow}><Calendar size={16} color="var(--primary)" /> JOINED: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</div>
                            </div>
                            <GlowButton onClick={() => setIsEditing(true)} style={{ marginTop: '2.5rem', width: '100%', justifyContent: 'center' }}>
                                <Edit3 size={16} /> MODIFY PARAMETERS
                            </GlowButton>
                        </GlassCard>
                    </div>

                    {/* 🚀 ROLE-SPECIFIC COMPONENTS */}
                    <div style={{ display: 'flex', width: '100%' }}>
                        {role === 'student' ? (
                            <StudentProfile stats={stats} badges={profile?.badges} xp={xp} />
                        ) : (
                            <TeacherProfile stats={stats} />
                        )}
                    </div>
                </div>

                {/* EDIT MODAL */}
                {isEditing && (
                    <div style={styles.modalOverlay}>
                        <GlassCard style={styles.modal}>
                            <h2 style={{ marginBottom: '2rem' }}>Modify Identity Matrix</h2>
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Full Name" />
                                <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="Email Address" />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>ABORT</button>
                                    <GlowButton type="submit" style={{ flex: 1, justifyContent: 'center' }}>COMMIT CHANGES</GlowButton>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    infoRow: { display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-glass)' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' },
    modal: { width: '100%', maxWidth: '450px', padding: '3rem' },
    cancelBtn: { background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }
};

export default Profile;
