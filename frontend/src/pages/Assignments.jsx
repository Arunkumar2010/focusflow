import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileText, Plus, Calendar, BookOpen, X, Sparkles } from 'lucide-react';
import assignmentService from '../services/assignmentService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [selectedId, setSelectedId] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const modalRef = React.useRef();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        batchId: '',
        dueDate: ''
    });

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [showModal]);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await assignmentService.getAssignments();
            if (res.success) {
                setAssignments(res.data);
                if (res.data.length > 0 && !selectedId) {
                    setSelectedId(res.data[0]._id);
                }
            }

            if (user?.role === 'teacher' || user?.role === 'admin') {
                const batchRes = await batchService.getTeacherBatches();
                if (batchRes.success) setBatches(batchRes.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setError(null);
            const res = await assignmentService.createAssignment(formData);
            if (res.success) {
                await fetchData();
                setShowModal(false);
                setFormData({ title: '', description: '', batchId: '', dueDate: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitSubmission = async (e) => {
        e.preventDefault();
        if (!submissionContent.trim()) return;

        try {
            setSubmitting(true);
            const res = await assignmentService.submitAssignment(selectedId, submissionContent);
            if (res.success) {
                const updatedRes = await assignmentService.getAssignments();
                if (updatedRes.success) setAssignments(updatedRes.data);
                setSubmissionContent('');
            }
        } catch (err) {
            alert('Failed to submit assignment.');
        } finally {
            setSubmitting(false);
        }
    };

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
    const selectedAssignment = assignments.find(a => a._id === selectedId);
    
    const mySubmission = selectedAssignment?.submissions?.find(
        s => s.studentId === user?._id || s.studentId?._id === user?._id
    );

    const getStatus = (assign) => {
        const submission = assign.submissions?.find(
            s => s.studentId === user?._id || s.studentId?._id === user?._id
        );
        if (submission) return { label: 'COMPLETED', type: 'success' };
        
        const isPastDue = new Date(assign.dueDate) < new Date();
        if (isPastDue) return { label: 'MISSING', type: 'danger' };
        
        return { label: 'PENDING', type: 'warning' };
    };

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Loading Vault..." /></div>;

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Knowledge <GradientText>Vault</GradientText>
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {isTeacher ? 'Manage batch coursework and research.' : 'Centralized repository for your academic assignments.'}
                        </p>
                    </div>
                    {isTeacher && (
                        <GlowButton onClick={() => setShowModal(true)}>
                            <Plus size={18} /> New Assignment
                        </GlowButton>
                    )}
                </header>

                <div className="assignments-page" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    {/* Left: Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {assignments.length > 0 ? assignments.map((assign, index) => {
                            const status = getStatus(assign);
                            return (
                                <GlassCard 
                                    key={assign._id} 
                                    className={`animate-in ${selectedId === assign._id ? 'border-primary' : ''}`}
                                    onClick={() => setSelectedId(assign._id)}
                                    style={{ cursor: 'pointer', padding: '1.5rem', borderLeft: selectedId === assign._id ? '4px solid var(--primary)' : '1px solid var(--border-glass)', animationDelay: `${index * 0.05}s` }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{assign.title}</h3>
                                        <NeonBadge color={status.type} style={{ fontSize: '0.65rem' }}>{status.label}</NeonBadge>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {new Date(assign.dueDate).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{assign.batchId?.name}</div>
                                    </div>
                                </GlassCard>
                            );
                        }) : (
                            <GlassCard style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.5 }}>
                                <FileText size={48} style={{ marginBottom: '1rem' }} />
                                <p>No records found.</p>
                            </GlassCard>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="right-panel">
                        {selectedAssignment ? (
                            <GlassCard style={{ padding: '2.5rem', minHeight: '500px', border: '1px solid var(--border-glass-bright)' }}>
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{selectedAssignment.title}</h2>
                                        <NeonBadge color={getStatus(selectedAssignment).type}>{getStatus(selectedAssignment).label}</NeonBadge>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                        <Sparkles size={16} color="var(--primary)" />
                                        Assigned by {selectedAssignment.teacherId?.name || 'Instructor'} • {new Date(selectedAssignment.createdAt).toLocaleDateString()}
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-glass)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                        {selectedAssignment.description || 'No detailed specifications provided.'}
                                    </div>
                                </div>

                                {!isTeacher && (
                                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2.5rem' }}>
                                        {mySubmission ? (
                                            <GlassCard style={{ background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)', padding: '2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#22c55e', marginBottom: '1rem', fontWeight: 800, letterSpacing: '1px', fontSize: '0.9rem' }}>
                                                    <BookOpen size={20} /> SUBMISSION RECORDED
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{mySubmission.content}</p>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                    Timestamp: {new Date(mySubmission.submittedAt).toLocaleString()}
                                                </div>
                                            </GlassCard>
                                        ) : (
                                            <form onSubmit={handleSubmitSubmission}>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>SUBMISSION PAYLOAD</label>
                                                    <Input 
                                                        as="textarea" 
                                                        placeholder="Enter solution content or deployment URL..." 
                                                        style={{ background: 'rgba(255,255,255,0.01)', minHeight: '150px' }}
                                                        value={submissionContent}
                                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <GlowButton type="submit" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} disabled={submitting}>
                                                    {submitting ? 'PROCESSING...' : 'INITIALIZE SUBMISSION'}
                                                </GlowButton>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </GlassCard>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '6rem 2rem', opacity: 0.2 }}>
                                <FileText size={80} style={{ marginBottom: '1.5rem' }} />
                                <p>Select an assignment to initialize view</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL REDESIGN (USING PORTAL FOR PERFECT CENTERING) */}
                {showModal && ReactDOM.createPortal(
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div 
                            className="modal-content animate-pop" 
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'relative' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Deploy New Assignment</h2>
                                <button className="close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <Input name="title" style={{ background: 'rgba(255,255,255,0.02)' }} value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Specifications</label>
                                    <Input as="textarea" name="description" style={{ background: 'rgba(255,255,255,0.02)', minHeight: '100px' }} value={formData.description} onChange={handleInputChange} rows={3} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Target Batch</label>
                                        <Input as="select" name="batchId" style={{ background: 'rgba(255,255,255,0.02)' }} value={formData.batchId} onChange={handleInputChange} required>
                                            <option value="">Select Target...</option>
                                            {batches.map(b => (
                                                <option key={b._id} value={b._id}>{b.name}</option>
                                            ))}
                                        </Input>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Deadline</label>
                                        <Input type="date" name="dueDate" style={{ background: 'rgba(255,255,255,0.02)' }} value={formData.dueDate} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <GlowButton type="submit" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} disabled={actionLoading}>
                                    {actionLoading ? 'DEPLOYING...' : 'INITIALIZE DEPLOYMENT'}
                                </GlowButton>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

export default Assignments;
