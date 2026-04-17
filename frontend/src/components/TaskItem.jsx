import React from 'react';
import { Trash2, Edit, CheckCircle, Circle, Clock, Tag, Book, PenTool, Hash, Folder, AlertCircle } from 'lucide-react';
import { formatDeadline, isApproaching, isOverdue } from '../utils/productivityHelper';
import '../styles/tasks.css';

const TaskItem = ({ task, onUpdate, onDelete, onEdit }) => {
    const isCompleted = task.status === 'Completed';

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'High': return 'var(--danger-color)';
            case 'Medium': return 'var(--warning-color)';
            default: return 'var(--success-color)';
        }
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Study': return <Book size={14} style={{marginRight:'4px'}}/>;
            case 'Assignment': return <PenTool size={14} style={{marginRight:'4px'}}/>;
            case 'Exam': return <AlertCircle size={14} style={{marginRight:'4px'}}/>;
            default: return <Folder size={14} style={{marginRight:'4px'}}/>;
        }
    };

    const handleToggleComplete = () => {
        onUpdate(task._id, { status: isCompleted ? 'Pending' : 'Completed' });
    };

    const overdue = isOverdue(task.deadline);
    const approaching = isApproaching(task.deadline);
    const priorityColor = getPriorityColor(task.priority);

    return (
        <div style={{
            borderLeft: `4px solid ${priorityColor}`,
            boxShadow: `0 4px 15px ${priorityColor}22`
        }} className={`task-card animate-fade-in hover-glow ${isCompleted ? 'completed' : ''}`}>
            
            <div className="task-left-section">
                <button onClick={handleToggleComplete} className="task-icon-btn">
                    {isCompleted ? <CheckCircle color="var(--success-color)" size={24}/> : <Circle color="var(--text-secondary)" size={24}/>}
                </button>
                <div className="task-content">
                    <div className="task-title-row">
                        <h3 className="task-title">
                            {task.title}
                        </h3>
                        {task.category && (
                            <span className="task-category-badge">
                                {getCategoryIcon(task.category)}
                                {task.category}
                            </span>
                        )}
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    {task.tags && task.tags.length > 0 && (
                        <div className="task-tags-container">
                            {task.tags.map((tag, idx) => (
                                <span key={idx} className="task-tag-badge">
                                    <Hash size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <div className="task-meta">
                        <span className="task-badge">{task.priority} Priority</span>
                        
                        <span className="task-deadline" style={{
                            color: overdue && !isCompleted ? 'var(--danger-color)' : approaching && !isCompleted ? 'var(--warning-color)' : 'var(--text-secondary)'
                        }}>
                            <Clock size={14} style={{ marginRight: '4px' }}/>
                            {formatDeadline(task.deadline)}
                            {overdue && !isCompleted && ' (Overdue)'}
                        </span>

                        {task.estimatedTime > 0 && (
                            <span className="task-est-time">
                                ~{task.estimatedTime}m
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="task-actions">
                <button onClick={() => onEdit(task)} className="task-action-btn" style={{color: 'var(--accent-color)'}} title="Edit Task">
                    <Edit size={18} />
                </button>
                <button onClick={() => onDelete(task._id)} className="task-action-btn" style={{color: 'var(--danger-color)'}} title="Delete Task">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
