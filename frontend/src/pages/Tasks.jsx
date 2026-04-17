import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { PlusCircle, Filter, Search, ArrowUpDown, ClipboardList, Zap } from 'lucide-react';
import { useAchievement } from '../context/AchievementContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import '../styles/tasks.css';

const Tasks = () => {
    const { triggerAchievements } = useAchievement();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    
    // Filters and Sort State
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
            
            if (fetchedTasks.length > 0) {
                setTasks(fetchedTasks);
            } else {
                setTasks([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tasks", error);
            setTasks([]);
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
            // Optimistic update
            setTasks(tasks.map(t => t._id === id ? { ...t, ...data } : t));
            const res = await taskService.updateTask(id, data);
            if (res && res.unlockedBadges && res.unlockedBadges.length > 0) {
                triggerAchievements(res.unlockedBadges);
            }
        } catch (error) {
            console.error("Error updating task", error);
            fetchTasks(); // Revert on failure
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
        // Only allow if no complex sorting is applied
        if (sortBy !== 'newest' && sortBy !== 'deadlineAsc') {
            alert("Please set Sort to 'Recently Added' or 'Deadline (Closest)' to reorder tasks manually.");
            return;
        }

        const reorderedTasks = Array.from(processedTasks);
        const [removed] = reorderedTasks.splice(startIndex, 1);
        reorderedTasks.splice(endIndex, 0, removed);
        
        // Reconstruct the tasks array
        const reorderedIds = reorderedTasks.map(t => t._id);
        const otherTasks = tasks.filter(t => !reorderedIds.includes(t._id));
        setTasks([...reorderedTasks, ...otherTasks]);
    };

    const openEditForm = (task) => {
        setTaskToEdit(task);
        setShowTaskForm(true);
    };

    let processedTasks = (Array.isArray(tasks) ? tasks : []).filter(task => {
        // Search
        if (searchQuery && !task.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // Status
        if (statusFilter !== 'All') {
            if (statusFilter === 'Completed' && task.status !== 'Completed') return false;
            if (statusFilter === 'Pending' && task.status === 'Completed') return false; 
        }
        // Category
        if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;
        // Priority
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
        
        return true;
    });

    // Sort
    processedTasks.sort((a, b) => {
        if (sortBy === 'deadlineAsc') {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'deadlineDesc') {
            return new Date(b.deadline) - new Date(a.deadline);
        } else if (sortBy === 'priority') {
            const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return p[b.priority] - p[a.priority];
        } else if (sortBy === 'newest') {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
    });

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Loading tasks..." /></div>;

    return (
        <div className="animate-fade-in page-container">
            <div>
                <header className="tasks-header">
                <div>
                    <h1 className="tasks-title">My Tasks</h1>
                    <p className="tasks-subtitle">Organize and track all your assignments and study goals.</p>
                </div>
                <Button variant="primary" onClick={() => { setTaskToEdit(null); setShowTaskForm(true); }}>
                    <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
                    New Task
                </Button>
            </header>

            <Card className="controls-container">
                <div className="search-box">
                    <Search size={18} color="var(--text-secondary)" />
                    <Input 
                        type="text" 
                        placeholder="Search tasks..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="filters-wrapper">
                    <div className="filter-group">
                        <Filter size={16} color="var(--text-secondary)" />
                        <Input as="select" className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending / In Progress</option>
                            <option value="Completed">Completed</option>
                        </Input>
                    </div>
                    <div className="filter-group">
                        <Input as="select" className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Study">Study</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Exam">Exam</option>
                            <option value="Personal">Personal</option>
                        </Input>
                    </div>
                    <div className="filter-group">
                        <ArrowUpDown size={16} color="var(--text-secondary)" />
                        <Input as="select" className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="deadlineAsc">Deadline (Closest)</option>
                            <option value="deadlineDesc">Deadline (Farthest)</option>
                            <option value="priority">Priority (High to Low)</option>
                            <option value="newest">Recently Added</option>
                        </Input>
                    </div>
                </div>
            </Card>

            <div className="task-list-wrapper">
                {(!tasks || tasks.length === 0) ? (
                    <Card className="no-tasks-container floating-widget text-center">
                        <div className="illustration-circle">
                            <ClipboardList size={48} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>No tasks found. Create your first task.</h2>
                        <Button variant="primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', marginTop: '1rem' }} onClick={() => setShowTaskForm(true)}>
                            <PlusCircle size={20} style={{ marginRight: '0.5rem' }} /> Add Task
                        </Button>
                    </Card>
                ) : processedTasks.length === 0 ? (
                    <Card className="empty-state text-center">
                        <Search size={40} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No matches found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Try adjusting your search or filters to find what you're looking for.</p>
                        <Button variant="secondary" onClick={() => {
                            setSearchQuery(''); setStatusFilter('All'); setCategoryFilter('All'); setPriorityFilter('All');
                        }}>Clear Filters</Button>
                    </Card>
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
