import React, { useState, useEffect } from 'react';
import { Layers, Users, Video, FileText, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import batchService from '../services/batchService';
import classService from '../services/classService';
import assignmentService from '../services/assignmentService';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Spinner from '../components/ui/Spinner';

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                if (user?.role === 'teacher' || user?.role === 'admin') {
                    const analyticsRes = await batchService.getTeacherAnalytics();
                    if (analyticsRes.success) setAnalytics(analyticsRes.data);
                }

                const classesRes = await classService.getClasses();
                if (classesRes.success) {
                    const sorted = (classesRes.data || [])
                        .filter(c => new Date(c.datetime) > new Date(new Date().getTime() - 2 * 60 * 60 * 1000))
                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                        .slice(0, 3);
                    setUpcomingClasses(sorted);
                }

                const assignmentsRes = await assignmentService.getAssignments();
                if (assignmentsRes.success) {
                    setRecentAssignments((assignmentsRes.data || []).slice(0, 3));
                }

            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Welcome back, <GradientText>{user?.name || 'User'} ✨</GradientText>
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>
                        {isTeacher ? "⚡ Your teaching ecosystem is synchronized." : "⚡ Track your academic performance and goals."}
                    </p>
                </header>

                {/* 🚀 ANALYTICS TILES */}
                {loading ? <Spinner text="Syncing Hub..." /> : isTeacher && analytics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.1s', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Layers size={18} /> ACTIVE BATCHES
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics.totalBatches}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.2s', borderLeft: '4px solid var(--secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Users size={18} /> TOTAL STUDENTS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics.totalStudents}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.3s', borderLeft: '4px solid #22c55e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Video size={18} /> NEXT SESSIONS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics.upcomingClasses}</h2>
                        </GlassCard>
                        <GlassCard className="animate-in" style={{ animationDelay: '0.4s', borderLeft: '4px solid #eab308' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <FileText size={18} /> ASSIGNMENTS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analytics.totalAssignments}</h2>
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
                        {upcomingClasses.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {upcomingClasses.map(cls => (
                                    <div key={cls._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '1rem' }}>{cls.title}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} /> {new Date(cls.datetime).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
                                                <Clock size={14} /> {new Date(cls.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                                <Sparkles size={32} style={{ marginBottom: '1rem' }} />
                                <p>No sessions scheduled.</p>
                            </div>
                        )}
                    </GlassCard>

                    {/* 🧊 ASSIGNMENTS WIDGET */}
                    <GlassCard className="glass-hover">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                                <FileText size={20} color="var(--secondary)" /> Academic Tasks
                            </h2>
                            <Link to="/assignments" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                VIEW ALL <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentAssignments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {recentAssignments.map(assign => (
                                    <div key={assign._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ fontWeight: '700', marginBottom: '0.25rem', fontSize: '1rem' }}>{assign.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>For {assign.batchId?.name}</div>
                                        <NeonBadge color="warning" style={{ fontSize: '0.7rem' }}>
                                            DUE: {new Date(assign.dueDate).toLocaleDateString()}
                                        </NeonBadge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                                <p>All clear for now.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
