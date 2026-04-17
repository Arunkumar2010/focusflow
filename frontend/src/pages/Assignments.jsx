import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, BookOpen, X } from 'lucide-react';
import assignmentService from '../services/assignmentService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Selection and Submission State
    const [selectedId, setSelectedId] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        batchId: '',
        dueDate: ''
    });

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
                // Refresh data to show submitted status
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
    
    // Check if current user has submitted the selected assignment
    const mySubmission = selectedAssignment?.submissions?.find(
        s => s.studentId === user?._id || s.studentId?._id === user?._id
    );

    const getStatus = (assign) => {
        const submission = assign.submissions?.find(
            s => s.studentId === user?._id || s.studentId?._id === user?._id
        );
        if (submission) return { label: 'Submitted', type: 'submitted' };
        
        const isPastDue = new Date(assign.dueDate) < new Date();
        if (isPastDue) return { label: 'Missing', type: 'missing' };
        
        return { label: 'Work Assigned', type: 'pending' };
    };

    return (
        <div className="animate-fade-in page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        <BookOpen size={32} color="#ED80FD" /> Assignments
                    </h1>
                    <p style={{ opacity: 0.7, marginTop: '0.4rem' }}>
                        {isTeacher ? 'Create and review batch coursework.' : 'Manage your upcoming and missing academic work.'}
                    </p>
                </div>
                {isTeacher && (
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> New Assignment
                    </Button>
                )}
            </header>

            {loading ? <Spinner text="Fetching assignments..." /> : (
                <div className="assignments-page">
                    {/* Left Panel: Feed */}
                    <div className="left-panel">
                        {assignments.length > 0 ? assignments.map((assign, index) => {
                            const status = getStatus(assign);
                            return (
                                <div 
                                    key={assign._id} 
                                    className={`assignment-card card ${selectedId === assign._id ? 'active' : ''}`}
                                    onClick={() => setSelectedId(assign._id)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{assign.title}</h3>
                                        <span className={`status-badge status-${status.type}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Badge variant="gray" style={{ fontSize: '0.7rem' }}>{assign.batchId?.name}</Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <Card style={{ textAlign: 'center', padding: '4rem' }}>
                                <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p style={{ opacity: 0.5 }}>No assignments available yet.</p>
                            </Card>
                        )}
                    </div>

                    {/* Right Panel: Selected Detail & Submission */}
                    <div className="right-panel">
                        {selectedAssignment ? (
                            <Card style={{ padding: '2rem', minHeight: '400px' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h2 style={{ margin: 0 }}>Your Work</h2>
                                        <StatusBadge status={getStatus(selectedAssignment)} />
                                    </div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1.5rem' }}>
                                        Assigned by {selectedAssignment.teacherId?.name || 'Instructor'} • {new Date(selectedAssignment.createdAt).toLocaleDateString()}
                                    </div>
                                    <p style={{ lineHeight: '1.6', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                                        {selectedAssignment.description || 'No detailed instructions provided.'}
                                    </p>
                                </div>

                                {!isTeacher && (
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                                        {mySubmission ? (
                                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.75rem', fontWeight: 600 }}>
                                                    <BookOpen size={18} /> Assignment Submitted
                                                </div>
                                                <div style={{ fontSize: '0.9rem', opacity: 0.8, wordBreak: 'break-all', marginBottom: '1rem' }}>
                                                    <strong>Your Content:</strong> {mySubmission.content}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                                                    Submitted on {new Date(mySubmission.submittedAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmitSubmission}>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ marginBottom: '1rem' }}>Upload Submission / Link</label>
                                                    <Input 
                                                        as="textarea" 
                                                        placeholder="Paste your submission link or detailed solution here..." 
                                                        value={submissionContent}
                                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                                        rows={5}
                                                        required
                                                    />
                                                </div>
                                                <Button 
                                                    type="submit" 
                                                    variant="primary" 
                                                    style={{ width: '100%', marginTop: '1rem' }}
                                                    disabled={submitting}
                                                >
                                                    {submitting ? 'Submitting...' : 'Mark as Done'}
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '4rem' }}>
                                <FileText size={64} style={{ marginBottom: '1rem' }} />
                                <p>Select an assignment to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal animate-fade-in shadow-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>Create Assignment</h2>
                            <X style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => { setShowModal(false); setError(null); }} />
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleCreateAssignment} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Assignment Title</label>
                                <Input name="title" placeholder="e.g. Mid-term Research Paper" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Detailed Description</label>
                                <Input as="textarea" name="description" placeholder="Provide instructions for students..." value={formData.description} onChange={handleInputChange} rows={3} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Target Batch</label>
                                    <Input as="select" name="batchId" value={formData.batchId} onChange={handleInputChange} required>
                                        <option value="">Select Batch</option>
                                        {batches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </Input>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Due Date</label>
                                    <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" disabled={actionLoading}>
                                    {actionLoading ? 'Creating...' : 'Assign to Batch'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => (
    <div className={`status-badge status-${status.type}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
        {status.label}
    </div>
);

export default Assignments;
