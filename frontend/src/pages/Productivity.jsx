import React, { useState, useEffect } from 'react';
import productivityService from '../services/productivityService';
import taskService from '../services/taskService';
import ProductivityChart from '../components/ProductivityChart';
import Timer from '../components/Timer';
import { Target, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import '../styles/productivity.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Productivity = () => {
    const [chartData, setChartData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [todayProductivity, setTodayProductivity] = useState({ productivityScore: 0, completedTasks: 0, pendingTasks: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductivity = async () => {
            try {
                setLoading(true);
                const [prodRes, todayRes, tasksRes] = await Promise.all([
                    productivityService.getProductivity(),
                    productivityService.getTodayProductivity(),
                    taskService.getTasks()
                ]);

                setChartData(prodRes.data);
                setTodayProductivity(todayRes.data);
                setTasks(tasksRes.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching productivity data", error);
                setLoading(false);
            }
        };

        fetchProductivity();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading productivity data...</div>;

    // Process data for Category Pie Chart
    const categoryCounts = tasks.reduce((acc, task) => {
        const cat = task.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    
    const pieData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));

    // Process data for Weekly Bar Chart (Tasks Completed vs Pending from chartData)
    const barData = chartData.slice(-7).map(item => {
        const d = new Date(item.date);
        return {
            name: `${d.getMonth() + 1}/${d.getDate()}`,
            completed: item.completedTasks,
            pending: item.pendingTasks
        };
    });

    // Calculate metrics
    const totalWeeklyCompleted = barData.reduce((sum, day) => sum + day.completed, 0);
    const avgScore = chartData.length > 0 
        ? Math.round(chartData.reduce((sum, day) => sum + day.productivityScore, 0) / chartData.length)
        : 0;

    return (
        <div className="animate-fade-in productivity-container">
            <header className="productivity-header">
                <h1 className="productivity-title">Productivity Analytics</h1>
                <p className="productivity-subtitle">Track your performance, analyze task distribution, and manage study sessions.</p>
            </header>

            {/* Top Metrics Row */}
            <div className="metrics-grid">
                <div className="metric-card glass-card">
                    <Activity color="var(--accent-color)" size={24} style={{ marginBottom: '0.5rem' }}/>
                    <h3 className="metric-title">Score Today</h3>
                    <div className="metric-value">{todayProductivity?.productivityScore || 0}%</div>
                </div>
                
                <div className="metric-card glass-card">
                    <Target color="var(--success-color)" size={24} style={{ marginBottom: '0.5rem' }}/>
                    <h3 className="metric-title">Weekly Completed</h3>
                    <div className="metric-value primary-text">{totalWeeklyCompleted} Tasks</div>
                </div>

                <div className="metric-card glass-card">
                    <BarChart2 color="var(--warning-color)" size={24} style={{ marginBottom: '0.5rem' }}/>
                    <h3 className="metric-title">Historical Avg Score</h3>
                    <div className="metric-value primary-text">{avgScore}%</div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Weekly Bar Chart */}
                <div className="chart-box glass-card">
                    <h3 className="chart-title"><BarChart2 size={18} /> Task Completion (Last 7 Days)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                />
                                <Legend />
                                <Bar dataKey="completed" name="Completed" fill="var(--success-color)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" name="Pending" fill="var(--warning-color)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="chart-box glass-card">
                    <h3 className="chart-title"><PieChartIcon size={18} /> Tasks by Category</h3>
                    <div className="chart-wrapper">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">No task categories found.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bottom-grid">
                {/* Trend Line Chart */}
                <div style={{ flex: 2 }}>
                    <ProductivityChart data={chartData} />
                </div>

                {/* Study Timer Component */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card timer-box">
                        <h3 className="chart-title">Study Session</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Use the Pomodoro technique to stay focused.
                        </p>
                        <Timer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Productivity;
