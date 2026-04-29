import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { GlassCard, GlowButton } from './ui/FuturisticUI';

const TaskForm = ({ onSave, onClose, initialData = null }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('Study');
    const [tags, setTags] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPriority(initialData.priority || 'Medium');
            setCategory(initialData.category || 'Study');
            setTags(initialData.tags ? initialData.tags.join(', ') : '');
            setEstimatedTime(initialData.estimatedTime || '');
            
            if (initialData.deadline) {
                const d = new Date(initialData.deadline);
                const formattedDate = d.toISOString().split('T')[0];
                setDeadline(formattedDate);
            }
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        
        await onSave({ 
            title, 
            description, 
            priority, 
            deadline, 
            category, 
            tags: tagsArray, 
            estimatedTime: Number(estimatedTime) || 0 
        });
        setSubmitting(false);
    };

    return (
        <div style={styles.overlay}>
            <GlassCard className="modal animate-in" style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                        {initialData ? 'Update Matrix Task' : 'Initialize New Task'}
                    </h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>TASK DESIGNATION</label>
                        <Input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Calculus Unit 4 Synchronization"
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>SPECIFICATIONS</label>
                        <Input
                            as="textarea"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Describe the objective parameters..."
                            rows="3"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>CATEGORY</label>
                            <Input
                                as="select"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={styles.input}
                            >
                                <option value="Study">Study</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Exam">Exam</option>
                                <option value="Personal">Personal</option>
                            </Input>
                        </div>

                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>PRIORITY LEVEL</label>
                            <Input
                                as="select"
                                name="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                style={styles.input}
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </Input>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>DEADLINE</label>
                            <Input
                                type="date"
                                name="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>ESTIMATED LOAD (MIN)</label>
                            <Input
                                type="number"
                                name="estimatedTime"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
                                placeholder="60"
                                min="0"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Abort
                        </button>
                        <GlowButton type="submit" disabled={submitting} style={{ padding: '12px 30px' }}>
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {initialData ? 'COMMIT UPDATE' : 'INITIALIZE TASK'}</>}
                        </GlowButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(8px)',
        padding: '1rem'
    },
    modal: {
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1px solid var(--border-glass-bright)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'color 0.3s ease'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontSize: '0.7rem',
        fontWeight: 800,
        color: 'var(--text-dim)',
        letterSpacing: '1px'
    },
    input: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-glass)'
    },
    row: {
        display: 'flex',
        gap: '1.25rem'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1.25rem',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        color: 'var(--text-muted)',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'color 0.3s ease'
    }
};

export default TaskForm;
