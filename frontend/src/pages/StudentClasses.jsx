import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Search } from 'lucide-react';
import classService from '../services/classService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const StudentClasses = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await classService.getClasses();
            if (res.success) {
                setClasses(res.data);
            }
        } catch (err) {
            setError('Failed to fetch classes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getBadgeVariant = (status) => {
        switch (status) {
            case 'Upcoming': return 'yellow';
            case 'Ongoing': return 'green';
            case 'Completed': return 'red';
            default: return 'secondary';
        }
    };

    const filteredClasses = classes.filter(cls => {
        const title = cls.title || '';
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || cls.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleJoin = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="animate-fade-in page-container">
            <div>
                <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <Video size={32} color="var(--accent-color)" /> My Classes
                        </h1>
                        <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>Access your live lectures and recorded sessions.</p>
                    </div>
                </header>

                <div className="form-row" style={{ marginBottom: '2.5rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label">Search Lectures</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <Input 
                                type="text" 
                                placeholder="Search by class title..." 
                                style={{ paddingLeft: '40px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Status Filter</label>
                        <Input 
                            as="select" 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </Input>
                    </div>
                </div>

                {loading ? (
                    <Spinner text="Fetching your lecture schedule..." />
                ) : error ? (
                    <Card style={{ textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <p style={{ color: '#ef4444' }}>{error}</p>
                    </Card>
                ) : filteredClasses.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: '4rem' }}>
                        <Video size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <h3 style={{ opacity: 0.7 }}>No classes schedule found</h3>
                        <p style={{ opacity: 0.5 }}>Check back later or adjust your filters.</p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {filteredClasses.map(cls => (
                            <Card key={cls._id} className="animate-float" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{cls.title}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', opacity: 0.8 }}>
                                            {cls.batchId?.name || 'Open Batch'}
                                        </span>
                                    </div>
                                    <Badge variant={getBadgeVariant(cls.status)}>
                                        {cls.status === 'Ongoing' && <span className="pulse-dot"></span>}
                                        {cls.status}
                                    </Badge>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', opacity: 0.7 }}>
                                        <Calendar size={15} /> {new Date(cls.date).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', opacity: 0.7 }}>
                                        <Clock size={15} /> {cls.time}
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    {cls.status === 'Ongoing' ? (
                                        <Button 
                                            variant="primary" 
                                            style={{ width: '100%' }}
                                            onClick={() => handleJoin(cls.meetingLink)}
                                        >
                                            Join Lecture Now
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="secondary" 
                                            disabled 
                                            style={{ width: '100%', opacity: 0.5 }}
                                        >
                                            {cls.status === 'Upcoming' ? 'Starts Soon' : 'Lecture Completed'}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <style>
                {`
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                `}
            </style>
        </div>
    );
};

export default StudentClasses;
