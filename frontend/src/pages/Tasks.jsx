import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import taskService from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { PlusCircle, Filter, Search, ArrowUpDown, ClipboardList } from 'lucide-react';
import { useAchievement } from '../context/AchievementContext';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import '../styles/tasks.css';

const Tasks = () => {
    const { tasks, syncTasks, updateTaskStatus, loading } = useApp();
    const { triggerAchievements } = useAchievement();
    
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [sortBy, setSortBy] = useState('deadlineAsc');

    const handleNewTask = () => {
        setTaskToEdit(null);
        setShowTaskForm(true);
    };

    const handleSaveTask = async (taskData) => {
        try {
            if (taskToEdit) {
                await taskService.updateTask(taskToEdit._id, taskData);
                setSuccessMessage('Task updated successfully ✅');
            } else {
                await taskService.createTask(taskData);
                setSuccessMessage('Task created ✅');
            }
            
            setShowTaskForm(false);
            setTaskToEdit(null);
            syncTasks(); // Refresh global state
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error saving task", error);
        }
    };

    const handleUpdateTask = async (id, data) => {
        // Use global status update
        await updateTaskStatus(id, data);
        
        // Handle achievements if needed
        const res = await taskService.updateTask(id, data).catch(() => null);
        if (res && res.unlockedBadges?.length > 0) {
            triggerAchievements(res.unlockedBadges);
        }
    };

    const handleDeleteTask = async (id) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                syncTasks();
            } catch (error) {
                console.error("Error deleting task", error);
            }
        }
    };

    const handleReorder = (startIndex, endIndex) => {
        // Reordering is purely local for UX in this session
        // In a real app, this would update a 'position' field in DB
    };

    const openEditForm = (task) => {
        setTaskToEdit(task);
        setShowTaskForm(true);
    };

    let processedTasks = (Array.isArray(tasks) ? tasks : []).filter(task => {
        if (searchQuery && !task.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (statusFilter !== 'All') {
            if (statusFilter === 'Completed' && task.status !== 'Completed') return false;
            if (statusFilter === 'Pending' && task.status === 'Completed') return false; 
        }
        if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
        return true;
    });

    processedTasks.sort((a, b) => {
        if (sortBy === 'deadlineAsc') return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === 'deadlineDesc') return new Date(b.deadline) - new Date(a.deadline);
        if (sortBy === 'priority') {
            const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return p[b.priority] - p[a.priority];
        }
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0;
    });

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Synchronizing..." /></div>;

    return (
        <div className="page-container">
            <div className="animate-in">
                {successMessage && (
                    <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: 'rgba(34, 197, 94, 0.9)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', zIndex: 9999, fontWeight: 700, boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
                        {successMessage}
                    </div>
                )}

                <header className="tasks-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 className="tasks-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Academic <GradientText>Task Board</GradientText>
                        </h1>
                        <p className="tasks-subtitle" style={{ color: 'var(--text-muted)' }}>Precision tracking for your study goals.</p>
                    </div>
                    <GlowButton onClick={handleNewTask} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <PlusCircle size={20} />
                        New Task
                    </GlowButton>
                </header>

                <GlassCard className="controls-container" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="search-box" style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <Input 
                                type="text" 
                                placeholder="Filter tasks by name..." 
                                style={{ paddingLeft: '3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="task-filters" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={16} style={{ color: 'var(--text-dim)' }} />
                                <Input as="select" style={{ minWidth: '140px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </Input>
                            </div>
                            <div className="filter-group">
                                <ArrowUpDown size={16} style={{ color: 'var(--text-dim)' }} />
                                <Input as="select" style={{ minWidth: '160px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="deadlineAsc">Closest Deadline</option>
                                    <option value="priority">High Priority</option>
                                    <option value="newest">Recent</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="task-list-wrapper">
                    {(!tasks || tasks.length === 0) ? (
                        <GlassCard className="text-center" style={{ padding: '5rem 2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(57, 209, 220, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <ClipboardList size={40} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No Tasks Recorded</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your journey by adding your first academic goal.</p>
                            <GlowButton onClick={handleNewTask}>
                                <PlusCircle size={20} /> Initialize Task
                            </GlowButton>
                        </GlassCard>
                    ) : processedTasks.length === 0 ? (
                        <GlassCard className="text-center" style={{ padding: '4rem' }}>
                            <Search size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <h3>No matches detected</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Try refining your filters.</p>
                        </GlassCard>
                    ) : (
                        <TaskList 
                            tasks={processedTasks} 
                            onUpdate={handleUpdateTask} 
                            onDelete={handleDeleteTask}
                            onEdit={openEditForm}
                            onReorder={handleReorder}
                        />
                    )}
                </div>

                {showTaskForm && (
                    <TaskForm 
                        initialData={taskToEdit} 
                        onClose={() => { setShowTaskForm(false); setTaskToEdit(null); }} 
                        onSave={handleSaveTask} 
                    />
                )}
            </div>
        </div>
    );
};

export default Tasks;
