import React, { useState, useEffect } from 'react';
import { Layers, Users, Video, FileText, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import batchService from '../services/batchService';
import classService from '../services/classService';
import assignmentService from '../services/assignmentService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
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
                
                // Fetch analytic counts for teachers
                if (user?.role === 'teacher' || user?.role === 'admin') {
                    const analyticsRes = await batchService.getTeacherAnalytics();
                    if (analyticsRes.success) setAnalytics(analyticsRes.data);
                }

                // Fetch upcoming classes
                const classesRes = await classService.getClasses();
                if (classesRes.success) {
                    const sorted = (classesRes.data || [])
                        .filter(c => new Date(c.datetime) > new Date(new Date().getTime() - 2 * 60 * 60 * 1000)) // Include ongoing
                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                        .slice(0, 3);
                    setUpcomingClasses(sorted);
                }

                // Fetch recent assignments
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
        <div className="animate-fade-in page-container">
            <div>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.name || 'User'}</h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>{isTeacher ? "Here's an overview of your teaching impact today." : "Keep track of your classes and assignments."}</p>
                </header>

                {/* Teacher Analytics Grid */}
                {loading ? <Spinner text="Syncing Dashboard..." /> : isTeacher && analytics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        <Card className="animate-float" style={{ borderLeft: '4px solid #39D1DC' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.6, marginBottom: '1rem' }}>
                                <Layers size={20} /> Total Batches
                            </div>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.totalBatches}</h2>
                        </Card>
                        <Card className="animate-float" style={{ borderLeft: '4px solid #ED80FD', animationDelay: '0.1s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.6, marginBottom: '1rem' }}>
                                <Users size={20} /> Total Students
                            </div>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.totalStudents}</h2>
                        </Card>
                        <Card className="animate-float" style={{ borderLeft: '4px solid #22c55e', animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.6, marginBottom: '1rem' }}>
                                <Video size={20} /> Upcoming Classes
                            </div>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.upcomingClasses}</h2>
                        </Card>
                        <Card className="animate-float" style={{ borderLeft: '4px solid #eab308', animationDelay: '0.3s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.6, marginBottom: '1rem' }}>
                                <FileText size={20} /> Active Assignments
                            </div>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.totalAssignments}</h2>
                        </Card>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {/* Classes Section */}
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                                <Video size={24} color="#39D1DC" /> {isTeacher ? 'Upcoming Sessions' : 'Next Classes'}
                            </h2>
                            <Link to="/classes" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        {upcomingClasses.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {upcomingClasses.map(cls => (
                                    <div key={cls._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{cls.title}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={12} /> {new Date(cls.datetime).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Clock size={12} /> {new Date(cls.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ opacity: 0.4, textAlign: 'center', padding: '2rem' }}>No sessions scheduled soon.</p>
                        )}
                    </Card>

                    {/* Assignments Section */}
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                                <FileText size={24} color="#ED80FD" /> Academic Tasks
                            </h2>
                            <Link to="/assignments" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                See details <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentAssignments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {recentAssignments.map(assign => (
                                    <div key={assign._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{assign.title}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.4, marginBottom: '0.5rem' }}>For {assign.batchId?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#eab308' }}>
                                            Due {new Date(assign.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ opacity: 0.4, textAlign: 'center', padding: '2rem' }}>All assignments completed.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
