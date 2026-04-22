import React, { useState, useEffect } from 'react';
import { Users, Plus, BookOpen, UserPlus, Mail, X } from 'lucide-react';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
            setError('Failed to fetch batches');
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
            setError(err.response?.data?.error || 'Failed to create batch.');
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
            setError(err.response?.data?.error || 'Failed to add student.');
        } finally {
            setActionLoading(false);
        }
    };

    const isStudent = user?.role === 'student';

    return (
        <div className="animate-fade-in page-container">
            <div>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <Users size={32} color="#39D1DC" /> {isStudent ? 'My Enrollments' : 'Batch Management'}
                        </h1>
                        <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>{isStudent ? 'Your active learning groups.' : 'Create and manage your student cohorts.'}</p>
                    </div>
                    {!isStudent && (
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} /> Create Batch
                        </Button>
                    )}
                </header>

                {loading ? <Spinner text="Loading your batches..." /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {batches.map((batch, index) => (
                            <Card key={batch._id} className="animate-float" style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{batch.name}</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#39D1DC', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                                            <BookOpen size={14} /> {batch.subject}
                                        </div>
                                    </div>
                                    {!isStudent && (
                                        <Button variant="primary" style={{ padding: '0.5rem' }} onClick={() => { setSelectedBatch(batch); setShowAddStudentModal(true); }}>
                                            <UserPlus size={16} />
                                        </Button>
                                    )}
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.75rem', opacity: 0.5, letterSpacing: '1px' }}>
                                        {isStudent ? 'INSTRUCTOR' : `STUDENTS (${batch.students?.length || 0})`}
                                    </div>
                                    {isStudent ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ background: 'var(--accent-gradient)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {batch.teacher?.name?.charAt(0) || 'T'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{batch.teacher?.name}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{batch.teacher?.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {batch.students?.slice(0, 3).map(s => (
                                                <div key={s._id} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail size={12} opacity={0.5} /> {s.name}
                                                </div>
                                            ))}
                                            {batch.students?.length > 3 && <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>+ {batch.students.length - 3} more students</div>}
                                            {(!batch.students || batch.students.length === 0) && <div style={{ fontSize: '0.8rem', opacity: 0.3 }}>Empty batch.</div>}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Created {new Date(batch.createdAt).toLocaleDateString()}</span>
                                    {isStudent ? (
                                        <Badge variant="green">ENROLLED</Badge>
                                    ) : (
                                        <Button variant="secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }} onClick={() => window.location.href=`/batches/${batch._id}`}>Manage</Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modals */}
                {showCreateModal && (
                    <div 
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} 
                        onClick={(e) => { if (createModalRef.current && !createModalRef.current.contains(e.target)) setShowCreateModal(false); }}
                    >
                        <Card ref={createModalRef} className="animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2>Create New Batch</h2>
                                <X style={{ cursor: 'pointer' }} onClick={() => { setShowCreateModal(false); setError(null); }} />
                            </div>
                            
                            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}
                            
                            <form onSubmit={handleCreateBatch}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label className="form-label">Batch Name</label>
                                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. CSE-A (2026)" required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Subject</label>
                                    <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g. Data Structures" required />
                                </div>
                                <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={actionLoading}>
                                    {actionLoading ? 'Creating...' : 'Create Batch'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}

                {showAddStudentModal && (
                    <div 
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} 
                        onClick={(e) => { if (addStudentModalRef.current && !addStudentModalRef.current.contains(e.target)) setShowAddStudentModal(false); }}
                    >
                        <Card ref={addStudentModalRef} className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h2>Add Student</h2>
                                <X style={{ cursor: 'pointer' }} onClick={() => { setShowAddStudentModal(false); setError(null); }} />
                            </div>
                            
                            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}
                            
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1.5rem' }}>Enroll a student into <strong>{selectedBatch?.name}</strong></p>
                            <form onSubmit={handleAddStudent}>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Student Email</label>
                                    <Input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="student@university.edu" required />
                                </div>
                                <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={actionLoading}>
                                    {actionLoading ? 'Enrolling...' : 'Add Student'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Batches;
