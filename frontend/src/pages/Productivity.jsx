import React, { useState, useEffect } from 'react';
import productivityService from '../services/productivityService';
import taskService from '../services/taskService';
import ProductivityChart from '../components/ProductivityChart';
import Timer from '../components/Timer';
import { Target, BarChart2, PieChart as PieChartIcon, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { GlassCard, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import Spinner from '../components/ui/Spinner';

const COLORS = ['#39D1DC', '#ED80FD', '#22c55e', '#eab308', '#ef4444'];

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
            } catch (error) {
                console.error("Error fetching productivity data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductivity();
    }, []);

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner text="Processing analytics..." /></div>;

    const categoryCounts = (tasks || []).reduce((acc, task) => {
        const cat = task.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    
    const pieData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));

    const barData = chartData.slice(-7).map(item => {
        const d = new Date(item.date);
        return {
            name: `${d.getMonth() + 1}/${d.getDate()}`,
            completed: item.completedTasks,
            pending: item.pendingTasks
        };
    });

    const totalWeeklyCompleted = barData.reduce((sum, day) => sum + day.completed, 0);
    const avgScore = chartData.length > 0 
        ? Math.round(chartData.reduce((sum, day) => sum + day.productivityScore, 0) / chartData.length)
        : 0;

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Performance <GradientText>Analytics</GradientText>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Deep metrics on your academic velocity and task distribution.</p>
                </header>

                {/* TOP METRICS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <GlassCard style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>
                            <Activity size={16} /> SYSTEM SCORE TODAY
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{todayProductivity?.productivityScore || 0}%</div>
                    </GlassCard>
                    <GlassCard style={{ padding: '2rem', borderLeft: '4px solid #22c55e' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>
                            <Target size={16} /> WEEKLY THROUGHPUT
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalWeeklyCompleted} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>TASKS</span></div>
                    </GlassCard>
                    <GlassCard style={{ padding: '2rem', borderLeft: '4px solid var(--secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>
                            <TrendingUp size={16} /> HISTORICAL BIAS
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{avgScore}% <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>AVG</span></div>
                    </GlassCard>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                    {/* WEEKLY BAR CHART */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <BarChart2 size={18} color="var(--primary)" /> Task Velocity (Last 7 Cycles)
                        </h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ background: 'rgba(10, 10, 18, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'white' }}
                                    />
                                    <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pending" name="Pending" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* PIE CHART */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <PieChartIcon size={18} color="var(--secondary)" /> Resource Allocation
                        </h3>
                        <div style={{ height: '300px' }}>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ background: 'rgba(10, 10, 18, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}
                                        />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>No allocation data.</div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* PRODUCTIVITY TREND */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <TrendingUp size={18} color="var(--primary)" /> Efficiency Timeline
                        </h3>
                        <ProductivityChart data={chartData} />
                    </GlassCard>

                    {/* MINI TIMER */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Sparkles size={18} color="var(--secondary)" /> Quick Focus
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Initialize a rapid productivity sequence.
                        </p>
                        <Timer />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Productivity;
