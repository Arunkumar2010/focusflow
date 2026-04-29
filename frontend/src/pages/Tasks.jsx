import React, { useState, useEffect } from 'react';
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
    const { triggerAchievements } = useAchievement();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [sortBy, setSortBy] = useState('deadlineAsc');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await taskService.getTasks().catch(() => ({ data: [] }));
            const fetchedTasks = Array.isArray(res?.data) ? res.data : [];
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Error fetching tasks", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSaveTask = async (taskData) => {
        try {
            if (taskToEdit) {
                await taskService.updateTask(taskToEdit._id, taskData);
            } else {
                await taskService.createTask(taskData);
            }
            setShowTaskForm(false);
            setTaskToEdit(null);
            fetchTasks();
        } catch (error) {
            console.error("Error saving task", error);
        }
    };

    const handleUpdateTask = async (id, data) => {
        try {
            setTasks(tasks.map(t => t._id === id ? { ...t, ...data } : t));
            const res = await taskService.updateTask(id, data);
            if (res && res.unlockedBadges && res.unlockedBadges.length > 0) {
                triggerAchievements(res.unlockedBadges);
            }
        } catch (error) {
            console.error("Error updating task", error);
            fetchTasks();
        }
    };

    const handleDeleteTask = async (id) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task", error);
            }
        }
    };

    const handleReorder = (startIndex, endIndex) => {
        if (sortBy !== 'newest' && sortBy !== 'deadlineAsc') return;
        const reorderedTasks = Array.from(processedTasks);
        const [removed] = reorderedTasks.splice(startIndex, 1);
        reorderedTasks.splice(endIndex, 0, removed);
        const reorderedIds = reorderedTasks.map(t => t._id);
        const otherTasks = tasks.filter(t => !reorderedIds.includes(t._id));
        setTasks([...reorderedTasks, ...otherTasks]);
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
                <header className="tasks-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 className="tasks-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Academic <GradientText>Task Board</GradientText>
                        </h1>
                        <p className="tasks-subtitle" style={{ color: 'var(--text-muted)' }}>Precision tracking for your study goals.</p>
                    </div>
                    <GlowButton onClick={() => { setTaskToEdit(null); setShowTaskForm(true); }}>
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
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                            <GlowButton onClick={() => setShowTaskForm(true)}>
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
