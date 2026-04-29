import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Users, Video, FileText, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import batchService from '../services/batchService';
import classService from '../services/classService';
import assignmentService from '../services/assignmentService';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Spinner from '../components/ui/Spinner';

const Dashboard = () => {
    // STEP 2 & 6: NEVER TRUST CONTEXT DIRECTLY
    const context = useApp();
    if (!context) return <Spinner text="Initializing Context..." />;
    const tasks = Array.isArray(context.tasks) ? context.tasks : [];
    
    // STEP 7: FIX USER DATA CRASH
    const auth = useAuth();
    let user = {};
    try {
        user = auth?.user || JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        user = {};
    }

    // STEP 8: PREVENT ROLE CRASH
    if (!user || !user.role) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
                <h2 style={{ color: 'var(--primary)' }}>Identity Matrix Offline</h2>
                <p style={{ color: 'var(--text-dim)' }}>Authentication telemetry is missing. Re-authorization required.</p>
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>RE-INITIALIZE SESSION</Link>
            </div>
        );
    }

    const [analytics, setAnalytics] = useState(null);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                const isAuth = user?.role === 'teacher' || user?.role === 'admin';
                if (isAuth) {
                    const analyticsRes = await batchService.getTeacherAnalytics().catch(() => ({ success: false }));
                    if (analyticsRes?.success) setAnalytics(analyticsRes.data);
                }

                const [classesRes, assignmentsRes] = await Promise.all([
                    classService.getClasses().catch(() => ({ success: false })),
                    assignmentService.getAssignments().catch(() => ({ success: false }))
                ]);

                if (classesRes?.success) {
                    const sorted = (Array.isArray(classesRes.data) ? classesRes.data : [])
                        .filter(c => c.datetime && new Date(c.datetime) > new Date(new Date().getTime() - 2 * 60 * 60 * 1000))
                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                        .slice(0, 3);
                    setUpcomingClasses(sorted || []);
                }

                if (assignmentsRes?.success) {
                    setRecentAssignments((Array.isArray(assignmentsRes.data) ? assignmentsRes.data : []).slice(0, 3) || []);
                }

            } catch (err) {
                console.error('Dashboard synchronization failure:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.role]);

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Welcome back, <GradientText>{user?.name || 'Academic Agent'} ✨</GradientText>
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>
                        {isTeacher ? "⚡ Your teaching ecosystem is synchronized." : "⚡ Track your academic performance and goals."}
                    </p>
                </header>

                {/* 🚀 ANALYTICS TILES */}
                {loading ? <Spinner text="Scanning Nexus..." /> : isTeacher && analytics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.1s', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Layers size={18} /> ACTIVE BATCHES
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics?.totalBatches || 0}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.2s', borderLeft: '4px solid var(--secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Users size={18} /> TOTAL STUDENTS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics?.totalStudents || 0}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.3s', borderLeft: '4px solid #22c55e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Video size={18} /> NEXT SESSIONS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics?.upcomingClasses || 0}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.4s', borderLeft: '4px solid #eab308' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <FileText size={18} /> ASSIGNMENTS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics?.totalAssignments || 0}</h2>
                        </GlassCard>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {/* 🧊 CLASSES WIDGET */}
                    <GlassCard className="glass-hover">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                                <Video size={20} color="var(--primary)" /> {isTeacher ? 'Upcoming Sessions' : 'Next Classes'}
                            </h2>
                            <Link to="/classes" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                FULL SCHEDULE <ArrowRight size={14} />
                            </Link>
                        </div>
                        { (Array.isArray(upcomingClasses) ? upcomingClasses : []).length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(Array.isArray(upcomingClasses) ? upcomingClasses : []).map(cls => (
                                    <div key={cls?._id || Math.random()} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '1rem' }}>{cls?.title || 'Untitled Nexus'}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} /> {cls?.datetime ? new Date(cls.datetime).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
                                                <Clock size={14} /> {cls?.datetime ? new Date(cls.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                                <Sparkles size={32} style={{ marginBottom: '1rem' }} />
                                <p>No active streams detected.</p>
                            </div>
                        )}
                    </GlassCard>

                    {/* 🧊 ASSIGNMENTS WIDGET */}
                    <GlassCard className="glass-hover">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                                <FileText size={20} color="var(--secondary)" /> Operational Tasks
                            </h2>
                            <Link to="/assignments" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                VIEW ALL <ArrowRight size={14} />
                            </Link>
                        </div>
                        { (Array.isArray(recentAssignments) ? recentAssignments : []).length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(Array.isArray(recentAssignments) ? recentAssignments : []).map(assign => (
                                    <div key={assign?._id || Math.random()} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ fontWeight: '700', marginBottom: '0.25rem', fontSize: '1rem' }}>{assign?.title || 'Untitled Objective'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>Assignment for {assign?.batchId?.name || 'Specific Cohort'}</div>
                                        <NeonBadge color="warning" style={{ fontSize: '0.7rem' }}>
                                            DUE: {assign?.dueDate ? new Date(assign.dueDate).toLocaleDateString() : 'N/A'}
                                        </NeonBadge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                                <p>Mission objectives clear for now.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
