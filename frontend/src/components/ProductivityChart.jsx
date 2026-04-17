import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/productivity.css';

const ProductivityChart = ({ data }) => {
    // Transform backend data for recharts
    const chartData = data.map(item => {
        const d = new Date(item.date);
        return {
            name: `${d.getMonth() + 1}/${d.getDate()}`,
            score: item.productivityScore,
            completed: item.completedTasks,
            pending: item.pendingTasks
        };
    });

    if (!chartData || chartData.length === 0) {
        return (
            <div className="productivity-chart-empty">
                <p>No productivity data available yet. Start completing tasks!</p>
            </div>
        );
    }

    return (
        <div className="productivity-chart-container glass-card">
            <h3 className="productivity-chart-title">Productivity Trend (Last 7 Days)</h3>
            <div className="productivity-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={chartData.slice(-7)} // Show last 7 days
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            itemStyle={{ color: 'var(--accent-color)' }}
                        />
                        <Area type="monotone" dataKey="score" name="Productivity Score" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProductivityChart;
