import React from 'react';
import { Trash2, Edit, CheckCircle, Circle, Clock, Hash, Book, PenTool, Folder, AlertCircle } from 'lucide-react';
import { formatDeadline, isApproaching, isOverdue } from '../utils/productivityHelper';
import { GlassCard, NeonBadge } from './ui/FuturisticUI';
import '../styles/tasks.css';

const TaskItem = ({ task, onUpdate, onDelete, onEdit }) => {
    const isCompleted = task.status === 'Completed';

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            default: return 'success';
        }
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Study': return <Book size={14} />;
            case 'Assignment': return <PenTool size={14} />;
            case 'Exam': return <AlertCircle size={14} />;
            default: return <Folder size={14} />;
        }
    };

    const handleToggleComplete = () => {
        onUpdate(task._id, { status: isCompleted ? 'Pending' : 'Completed' });
    };

    const overdue = isOverdue(task.deadline);
    const approaching = isApproaching(task.deadline);
    const priorityColor = getPriorityColor(task.priority);

    return (
        <GlassCard 
            className={`task-card ${isCompleted ? 'opacity-60' : ''}`}
            style={{ 
                marginBottom: '1rem', 
                borderLeft: `4px solid ${priorityColor === 'danger' ? '#ef4444' : priorityColor === 'warning' ? '#eab308' : '#22c55e'}`,
                padding: '1.25rem'
            }}
        >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <button 
                    onClick={handleToggleComplete} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                >
                    {isCompleted ? <CheckCircle color="#22c55e" size={24}/> : <Circle color="var(--text-dim)" size={24}/>}
                </button>
                
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '1.1rem', 
                                fontWeight: 700,
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? 'var(--text-dim)' : 'var(--text-main)'
                            }}>
                                {task.title}
                            </h3>
                            {task.category && (
                                <NeonBadge color="primary" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {getCategoryIcon(task.category)}
                                    {task.category}
                                </NeonBadge>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => onEdit(task)} style={styles.actionBtn} title="Edit Task">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => onDelete(task._id)} style={{ ...styles.actionBtn, color: '#ef4444' }} title="Delete Task">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {task.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <NeonBadge color={priorityColor} style={{ fontSize: '0.65rem' }}>
                                {task.priority}
                            </NeonBadge>
                            
                            <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.4rem', 
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: overdue && !isCompleted ? '#ef4444' : approaching && !isCompleted ? '#eab308' : 'var(--text-dim)'
                            }}>
                                <Clock size={14} />
                                {formatDeadline(task.deadline)}
                                {overdue && !isCompleted && ' (EXPIRED)'}
                            </span>
                        </div>
                        
                        {task.tags && task.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {task.tags.map((tag, idx) => (
                                    <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.6 }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

const styles = {
    actionBtn: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-dim)',
        padding: '6px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default TaskItem;
