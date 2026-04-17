import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';

const TaskForm = ({ onSave, onClose, initialData = null }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('Study');
    const [tags, setTags] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        
        onSave({ 
            title, 
            description, 
            priority, 
            deadline, 
            category, 
            tags: tagsArray, 
            estimatedTime: Number(estimatedTime) || 0 
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal animate-fade-in shadow-2xl">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
                    <X 
                        style={{ cursor: 'pointer', opacity: 0.6 }} 
                        size={20} 
                        onClick={onClose} 
                    />
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Task Title</label>
                        <Input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Study for Calculus Exam"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <Input
                            as="textarea"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="What needs to be done?"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <Input
                                as="select"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Study">Study</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Exam">Exam</option>
                                <option value="Personal">Personal</option>
                            </Input>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <Input
                                name="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="math, urgent..."
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <Input
                                as="select"
                                name="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Input>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Deadline</label>
                            <Input
                                type="date"
                                name="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Estimated Minutes</label>
                        <Input
                            type="number"
                            name="estimatedTime"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            placeholder="60"
                            min="0"
                        />
                    </div>

                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            <Save size={18} />
                            {initialData ? 'Update' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
    },
    modal: {
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        margin: '1rem',
        padding: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    row: {
        display: 'flex',
        gap: '1rem'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)'
    }
};

export default TaskForm;
