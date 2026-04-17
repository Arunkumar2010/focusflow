import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Link as LinkIcon, Plus, Info, X } from 'lucide-react';
import classService from '../services/classService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
                
                let status = "Upcoming";
                let badgeVariant = "yellow";
                
                if (now >= classTime && now <= oneHourLater) {
                    status = "Ongoing";
                    badgeVariant = "green";
                } else if (now > oneHourLater) {
                    status = "Completed";
                    badgeVariant = "red";
                }
                
                return { ...cls, currentStatus: status, badgeVariant };
            });

            setClasses(processedClasses);

            if (user?.role === 'teacher' || user?.role === 'admin') {
                const batchesRes = await batchService.getTeacherBatches();
                if (batchesRes.success) setBatches(batchesRes.data);
            }
        } catch (err) {
            setError('Server error, check backend');
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
            setError("Please provide all required fields");
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
            console.log(err.response?.data);
            setError(err.response?.data?.message || 'Failed to schedule class.');
        }
    };

    return (
        <div className="animate-fade-in page-container">
            <div>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <Video size={32} color="#39D1DC" /> Live Classes
                        </h1>
                        <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>Manage your virtual lecture schedule.</p>
                    </div>
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} /> Schedule Class
                        </Button>
                    )}
                </header>

                {loading ? <Spinner text="Loading your schedule..." /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {classes?.map((cls, index) => (
                            <Card key={cls._id || index} className="animate-float" style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{cls.title}</h3>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{cls.batchId?.name}</div>
                                    </div>
                                    <Badge variant={cls.badgeVariant}>{cls.currentStatus}</Badge>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem', flex: 1 }}>
                                    {cls.description || 'No description provided.'}
                                </p>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <Calendar size={16} /> {new Date(cls.datetime).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Clock size={16} /> {new Date(cls.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {cls.currentStatus === 'Ongoing' ? (
                                    <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <Button variant="primary" style={{ width: '100%' }}>Join Class</Button>
                                    </a>
                                ) : (
                                    <Button variant="secondary" disabled style={{ width: '100%', opacity: 0.5 }}>
                                        {cls.currentStatus === 'Upcoming' ? 'Starts Soon' : 'Closed'}
                                    </Button>
                                )}
                            </Card>
                        ))}
                        {(!classes || classes.length === 0) && (
                            <Card style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                                <Video size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <h3 style={{ opacity: 0.7 }}>No Classes Scheduled</h3>
                                <p style={{ opacity: 0.5 }}>There are currently no live lectures planned for your batches.</p>
                            </Card>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal animate-fade-in shadow-xl">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <h2 style={{ margin: 0 }}>Schedule Live Class</h2>
                                <X style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => { setShowModal(false); setError(null); }} />
                            </div>

                            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>{error}</div>}

                            <form onSubmit={handleCreateClass}>
                                <div className="form-group">
                                    <label className="form-label">Lecture Title</label>
                                    <Input name="title" placeholder="e.g. Advanced React Architecture" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brief Description</label>
                                    <Input as="textarea" name="description" placeholder="Topics to be covered..." value={formData.description} onChange={handleInputChange} rows={3} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Target Batch</label>
                                    <Input as="select" name="batch" value={formData.batch} onChange={handleInputChange} required>
                                        <option value="">Select Batch</option>
                                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </Input>
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Date</label>
                                        <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Start Time</label>
                                        <Input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Virtual Meeting Link</label>
                                    <Input type="url" name="meetingLink" placeholder="Zoom, Meet, or Teams URL" value={formData.meetingLink} onChange={handleInputChange} required />
                                </div>
                                <Button type="submit" variant="primary" style={{ width: '100%' }}>Schedule Now</Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveClasses;
