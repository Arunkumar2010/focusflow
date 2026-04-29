import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Video, Calendar, Clock, Plus, X, Sparkles, Activity } from 'lucide-react';
import classService from '../services/classService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const LiveClasses = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        batch: '',
        date: '',
        time: '',
        meetingLink: ''
    });

    // Prevent background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [showModal]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const classesRes = await classService.getClasses();
            
            const now = new Date();
            const processedClasses = (classesRes.data || []).map(cls => {
                const classTime = new Date(cls.datetime);
                const oneHourLater = new Date(classTime.getTime() + 60 * 60 * 1000);
                
                let status = "UPCOMING";
                let badgeColor = "warning";
                
                if (now >= classTime && now <= oneHourLater) {
                    status = "LIVE NOW";
                    badgeColor = "success";
                } else if (now > oneHourLater) {
                    status = "ARCHIVED";
                    badgeColor = "danger";
                }
                
                return { ...cls, currentStatus: status, badgeColor };
            });

            setClasses(processedClasses);

            if (user?.role === 'teacher' || user?.role === 'admin') {
                const batchesRes = await batchService.getTeacherBatches();
                if (batchesRes.success) setBatches(batchesRes.data);
            }
        } catch (err) {
            setError('Connection failure: Unable to synchronize with satellite hub.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setError(null);
        const { title, batch, date, time, meetingLink } = formData;
        
        if (!title || !batch || !date || !time || !meetingLink) {
            setError("All telemetry fields are required for deployment.");
            return;
        }

        try {
            const datetimeStr = `${date}T${time}:00`;
            const payload = {
                title,
                description: formData.description,
                batchId: batch,
                datetime: new Date(datetimeStr).toISOString(),
                meetingLink
            };

            const res = await classService.createClass(payload);
            if(res) {
                fetchData(); 
                setShowModal(false);
                setFormData({ title: '', description: '', batch: '', date: '', time: '', meetingLink: '' });
            }
        } catch(err) {
            setError(err.response?.data?.message || 'Schedule deployment failed.');
        }
    };

    // Modal Component using Portal
    const SessionModal = ({ onClose }) => {
        return createPortal(
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Initialize Session</h2>
                        <button 
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} 
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {error && <div style={styles.errorAlert}>{error}</div>}

                    <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>NEXUS DESIGNATION</label>
                            <Input name="title" style={{ background: 'rgba(255,255,255,0.03)' }} placeholder="e.g. CORE-SYSTEMS ARCHITECTURE" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>BRIEFING</label>
                            <Input as="textarea" name="description" style={{ background: 'rgba(255,255,255,0.03)' }} placeholder="Deployment instructions..." value={formData.description} onChange={handleInputChange} rows={2} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>TARGET COHORT</label>
                            <Input as="select" name="batch" style={{ background: 'rgba(255,255,255,0.03)' }} value={formData.batch} onChange={handleInputChange} required>
                                <option value="">Select Target...</option>
                                {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </Input>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>DATE</label>
                                <Input type="date" name="date" style={{ background: 'rgba(255,255,255,0.03)' }} value={formData.date} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>TIME</label>
                                <Input type="time" name="time" style={{ background: 'rgba(255,255,255,0.03)' }} value={formData.time} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>VIRTUAL NEXUS LINK</label>
                            <Input type="url" name="meetingLink" style={{ background: 'rgba(255,255,255,0.03)' }} placeholder="https://..." value={formData.meetingLink} onChange={handleInputChange} required />
                        </div>
                        <GlowButton type="submit" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                            DEPLOY TO NEXUS
                        </GlowButton>
                    </form>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Virtual <GradientText>Nexus</GradientText>
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time synchronization for global academic sessions.</p>
                    </div>
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                        <GlowButton onClick={() => setShowModal(true)}>
                            <Plus size={18} /> Schedule Session
                        </GlowButton>
                    )}
                </header>

                {loading ? <Spinner text="Synchronizing streams..." /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                        {classes?.map((cls, index) => (
                            <GlassCard key={cls._id || index} className="animate-in" style={{ animationDelay: `${index * 0.05}s`, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ maxWidth: '70%' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, marginBottom: '0.25rem' }}>{cls.title}</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{cls.batchId?.name}</div>
                                    </div>
                                    <NeonBadge color={cls.badgeColor}>{cls.currentStatus}</NeonBadge>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>
                                    {cls.description || 'System data: No additional specifications provided.'}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={14} color="var(--primary)" /> {new Date(cls.datetime).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Clock size={14} color="var(--secondary)" /> {new Date(cls.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {cls.currentStatus === 'LIVE NOW' ? (
                                    <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <GlowButton style={{ width: '100%', justifyContent: 'center' }}>
                                            <Activity size={18} /> INITIALIZE CONNECTION
                                        </GlowButton>
                                    </a>
                                ) : (
                                    <GlowButton variant="secondary" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.4 }}>
                                        {cls.currentStatus === 'UPCOMING' ? 'SESSION PENDING' : 'CONNECTION TERMINATED'}
                                    </GlowButton>
                                )}
                            </GlassCard>
                        ))}
                        {(!classes || classes.length === 0) && (
                            <GlassCard style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', opacity: 0.5 }}>
                                <Video size={64} style={{ marginBottom: '1.5rem', color: 'var(--text-dim)' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem' }}>No Active Streams</h3>
                                <p style={{ color: 'var(--text-dim)' }}>The nexus is currently quiet. No sessions are initialized.</p>
                            </GlassCard>
                        )}
                    </div>
                )}

                {/* MODAL PORTAL */}
                {showModal && <SessionModal onClose={() => setShowModal(false)} />}
            </div>
        </div>
    );
};

const styles = {
    errorAlert: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        fontSize: '0.85rem',
        textAlign: 'center'
    }
};

export default LiveClasses;
