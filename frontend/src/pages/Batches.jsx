import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Users, Plus, BookOpen, UserPlus, Mail, X, Shield, Sparkles } from 'lucide-react';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const Batches = () => {
    const { user } = useAuth();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [studentEmail, setStudentEmail] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const createModalRef = React.useRef();
    const addStudentModalRef = React.useRef();
    
    const [formData, setFormData] = useState({
        name: '',
        subject: ''
    });

    const isModalOpen = showCreateModal || showAddStudentModal;

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isModalOpen]);

    useEffect(() => {
        fetchBatches();
    }, [user]);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const res = user?.role === 'student' 
                ? await batchService.getStudentBatches()
                : await batchService.getTeacherBatches();
            
            if (res && res.success) {
                setBatches(res.data || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to synchronize batch records.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setError(null);
            const res = await batchService.createBatch(formData);
            if(res.success) {
                setBatches([...batches, res.data]);
                setShowCreateModal(false);
                setFormData({ name: '', subject: '' });
            }
        } catch(err) {
            setError(err.response?.data?.error || 'Batch initialization failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return;

        try {
            setActionLoading(true);
            setError(null);
            const res = await batchService.addStudent(selectedBatch._id, studentEmail);
            if (res.success) {
                setBatches(batches.map(b => b._id === selectedBatch._id ? res.data : b));
                setShowAddStudentModal(false);
                setStudentEmail('');
                setSelectedBatch(null);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Student enrollment failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const isStudent = user?.role === 'student';

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Cohort <GradientText>Management</GradientText>
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>{isStudent ? 'Your active learning clusters.' : 'Deploy and manage your educational cohorts.'}</p>
                    </div>
                    {!isStudent && (
                        <GlowButton onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} /> Initialize Cohort
                        </GlowButton>
                    )}
                </header>

                {loading ? <Spinner text="Querying cohorts..." /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                        {batches.map((batch, index) => (
                            <GlassCard key={batch._id} className="animate-in" style={{ animationDelay: `${index * 0.05}s`, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem' }}>{batch.name}</h3>
                                        <NeonBadge color="primary" style={{ fontSize: '0.7rem' }}>
                                            <BookOpen size={12} style={{ marginRight: '4px' }} /> {batch.subject}
                                        </NeonBadge>
                                    </div>
                                    {!isStudent && (
                                        <button 
                                            style={{ background: 'rgba(57, 209, 220, 0.1)', border: '1px solid rgba(57, 209, 220, 0.2)', color: 'var(--primary)', padding: '8px', borderRadius: '10px', cursor: 'pointer' }} 
                                            onClick={() => { setSelectedBatch(batch); setShowAddStudentModal(true); }}
                                            title="Add Student"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                    )}
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '16px', flex: 1 }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-dim)', letterSpacing: '1.5px' }}>
                                        {isStudent ? 'INSTRUCTOR PROFILE' : `ENROLLED UNITS (${batch.students?.length || 0})`}
                                    </div>
                                    {isStudent ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--accent-gradient)', width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white' }}>
                                                {batch.teacher?.name?.charAt(0) || 'T'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{batch.teacher?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{batch.teacher?.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {batch.students?.slice(0, 3).map(s => (
                                                <div key={s._id} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}></div>
                                                    {s.name}
                                                </div>
                                            ))}
                                            {batch.students?.length > 3 && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', marginLeft: '1.2rem' }}>+ {batch.students.length - 3} additional units</div>}
                                            {(!batch.students || batch.students.length === 0) && <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No units detected.</div>}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(batch.createdAt).toLocaleDateString()}</span>
                                    {isStudent ? (
                                        <NeonBadge color="success">AUTHORIZED</NeonBadge>
                                    ) : (
                                        <GlowButton variant="secondary" style={{ fontSize: '0.75rem', padding: '6px 16px' }} onClick={() => window.location.hash=`/batches/${batch._id}`}>
                                            VIEW ARCHIVE
                                        </GlowButton>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}

                {/* MODALS (USING PORTALS) */}
                {showCreateModal && ReactDOM.createPortal(
                    <div className="batch-modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="batch-modal" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Cohort Initialization</h2>
                                <button className="close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} onClick={() => setShowCreateModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {error && <div style={styles.errorAlert}>{error}</div>}
                            
                            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Batch Designation</label>
                                    <Input name="name" style={{ background: 'rgba(255,255,255,0.02)' }} value={formData.name} onChange={handleInputChange} placeholder="e.g. ALPHA-SECURE-2026" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Core Subject</label>
                                    <Input name="subject" style={{ background: 'rgba(255,255,255,0.02)' }} value={formData.subject} onChange={handleInputChange} placeholder="e.g. Quantum Cryptography" required />
                                </div>
                                <GlowButton type="submit" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} disabled={actionLoading}>
                                    {actionLoading ? 'INITIALIZING...' : 'START DEPLOYMENT'}
                                </GlowButton>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}

                {showAddStudentModal && ReactDOM.createPortal(
                    <div className="batch-modal-overlay" onClick={() => setShowAddStudentModal(false)}>
                        <div className="batch-modal" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Enroll Unit</h2>
                                <button className="close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} onClick={() => setShowAddStudentModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {error && <div style={styles.errorAlert}>{error}</div>}
                            
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Targeting Cohort: <GradientText>{selectedBatch?.name}</GradientText></p>
                            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Identity Email</label>
                                    <Input type="email" style={{ background: 'rgba(255,255,255,0.02)' }} value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="unit@network.io" required />
                                </div>
                                <GlowButton type="submit" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }} disabled={actionLoading}>
                                    {actionLoading ? 'ENROLLING...' : 'AUTHORIZE ENROLLMENT'}
                                </GlowButton>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}

                <style>{`
                    .batch-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(5, 10, 25, 0.75);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        z-index: 99999;
                    }

                    .batch-modal {
                        width: 480px;
                        max-width: 92%;
                        max-height: 90vh;
                        overflow-y: auto;
                        padding: 28px;
                        border-radius: 16px;
                        background: rgba(15, 20, 40, 0.98);
                        border: 1px solid rgba(255,255,255,0.08);
                        position: relative;
                        animation: fadeUp 0.25s ease;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                        color: white;
                    }

                    .batch-modal .close-btn {
                        position: absolute;
                        top: 14px;
                        right: 18px;
                        cursor: pointer;
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(25px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
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

export default Batches;
