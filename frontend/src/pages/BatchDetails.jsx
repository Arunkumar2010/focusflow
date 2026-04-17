import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, UserMinus, Plus, Mail, ArrowLeft } from 'lucide-react';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';

const BatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');

    useEffect(() => {
        fetchBatchDetails();
    }, [id]);

    const fetchBatchDetails = async () => {
        try {
            setLoading(true);
            const res = await batchService.getBatch(id);
            if(res.success) {
                setBatch(res.data);
            }
        } catch(err) {
            setError('Failed to fetch batch details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddSuccess('');
        try {
            const res = await batchService.addStudent(id, studentEmail);
            if(res.success) {
                setAddSuccess('Student added successfully!');
                setStudentEmail('');
                // Refresh batch details
                fetchBatchDetails();
                setTimeout(() => setAddSuccess(''), 3000);
            }
        } catch(err) {
            setAddError(err.response?.data?.error || 'Failed to add student');
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if(window.confirm('Are you sure you want to remove this student from the batch?')) {
            try {
                const res = await batchService.removeStudent(id, studentId);
                if(res.success) {
                    setAddSuccess('Student removed successfully');
                    fetchBatchDetails();
                    setTimeout(() => setAddSuccess(''), 3000);
                }
            } catch(err) {
                setAddError(err.response?.data?.error || 'Failed to remove student');
            }
        }
    };

    if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return (
            <div className="bg-illustration animate-fade-in" style={{ padding: '2rem', minHeight: 'calc(100vh - 80px)' }}>
                <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                    <h2>Access Denied</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>You must be a teacher to manage batches.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading batch details...</div>;
    if (error || !batch) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error || 'Batch not found'}</div>;

    return (
        <div className="bg-illustration animate-fade-in" style={{ padding: '2rem', minHeight: 'calc(100vh - 80px)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                
                <header style={{ marginBottom: '2rem' }}>
                    <button 
                        onClick={() => navigate('/batches')} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
                    >
                        <ArrowLeft size={16} /> Back to Batches
                    </button>
                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--accent-color)' }}>{batch.name}</h1>
                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Course: {batch.course}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{batch.students.length}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Enrolled Students</div>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'flex-start' }}>
                    
                    {/* Add Student Sidebar */}
                    <div className="glass-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '1.5rem' }}>
                            <Plus size={18} /> Add Student
                        </h3>
                        
                        {addError && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{Array.isArray(addError) ? addError[0] : addError}</div>}
                        {addSuccess && <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: '1px solid var(--success-color)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{addSuccess}</div>}

                        <form onSubmit={handleAddStudent}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={14} /> Student Email
                                </label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={studentEmail} 
                                    onChange={(e) => setStudentEmail(e.target.value)} 
                                    placeholder="student@university.edu" 
                                    required 
                                />
                                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>The student must already have registered an account to be added.</small>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={16} /> Assign to Batch
                            </button>
                        </form>
                    </div>

                    {/* Student List */}
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={18} color="var(--accent-color)" />
                            <h3 style={{ margin: 0 }}>Enrolled Students</h3>
                        </div>
                        
                        {batch.students.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No students have been added to this batch yet.
                            </div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {batch.students.map((student, index) => (
                                    <li 
                                        key={student._id} 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            padding: '1rem 1.5rem', 
                                            borderBottom: index < batch.students.length - 1 ? '1px solid var(--border-color)' : 'none',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{student.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                                        </div>
                                        <button 
                                            className="btn btn-danger" 
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            onClick={() => handleRemoveStudent(student._id)}
                                        >
                                            <UserMinus size={14} /> Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BatchDetails;
