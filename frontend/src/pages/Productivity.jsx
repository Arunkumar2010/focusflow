import React from "react";
import { useApp } from "../context/AppContext";
import { GlassCard, GradientText } from "../components/ui/FuturisticUI";
import { Activity, CheckCircle, Clock, BarChart3, TrendingUp, Sparkles } from "lucide-react";

const Productivity = () => {
    const context = useApp();
    const tasks = Array.isArray(context?.tasks) ? context.tasks : [];

    const total = tasks.length;
    // Status can be "completed" or "Completed" depending on service
    const completed = tasks.filter(t => t?.status?.toLowerCase() === "completed").length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // LAST 7 DAYS SIMPLE DATA
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const count = tasks.filter(t => {
            if (!t?.createdAt) return false;
            return new Date(t.createdAt).toDateString() === d.toDateString();
        }).length;

        return { 
            day: d.toLocaleDateString("en-US", { weekday: "short" }), 
            count,
            date: d.toDateString()
        };
    }).reverse();

    return (
        <div className="page-container">
            <div className="animate-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Performance <GradientText>Analytics</GradientText>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Precision tracking for your academic throughput.</p>
                </header>

                {/* TOP CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <GlassCard style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BarChart3 size={14} /> TOTAL
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{total}</div>
                    </GlassCard>
                    <GlassCard style={{ padding: '1.5rem', borderLeft: '4px solid #22c55e' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={14} /> COMPLETED
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{completed}</div>
                    </GlassCard>
                    <GlassCard style={{ padding: '1.5rem', borderLeft: '4px solid #eab308' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} /> PENDING
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{pending}</div>
                    </GlassCard>
                    <GlassCard style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={14} /> RATE
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{completionRate}%</div>
                    </GlassCard>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {/* WEEKLY ACTIVITY (BARS) */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.25rem' }}>
                            <TrendingUp size={20} color="var(--primary)" /> Weekly Activity
                        </h3>
                        <div style={{ display: "flex", alignItems: 'flex-end', justifyContent: 'space-between', gap: "10px", height: '150px', paddingBottom: '20px' }}>
                            {last7Days.map((d, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div
                                        style={{
                                            height: `${Math.max(d.count * 30, 4)}px`,
                                            width: "100%",
                                            maxWidth: '30px',
                                            background: d.count > 0 ? "var(--primary)" : "rgba(255,255,255,0.05)",
                                            borderRadius: "6px",
                                            transition: 'height 0.5s ease-out',
                                            boxShadow: d.count > 0 ? '0 0 15px var(--primary-low)' : 'none'
                                        }}
                                    />
                                    <small style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>{d.day}</small>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* PROGRESS BAR */}
                    <GlassCard style={{ padding: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.25rem' }}>
                            <Activity size={20} color="var(--secondary)" /> Productivity Score
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', height: '100px' }}>
                            <div style={{
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: "20px",
                                height: "14px",
                                overflow: "hidden",
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <div style={{
                                    width: `${completionRate}%`,
                                    height: "100%",
                                    background: "var(--accent-gradient)",
                                    boxShadow: '0 0 20px var(--primary-low)',
                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completionRate}% <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>Efficiency</span></span>
                                <Sparkles size={20} color="var(--secondary)" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* INSIGHTS */}
                    <GlassCard style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                            <Sparkles size={20} color="#eab308" /> Performance Insights
                        </h3>
                        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                            {total === 0 && <p style={{ color: 'var(--text-muted)' }}>No operational data detected. Initialize tasks to start telemetry.</p>}
                            {total > 0 && completionRate < 40 && <p style={{ color: '#ef4444' }}>System Alert: Your throughput is suboptimal. Increase consistency to stabilize metrics.</p>}
                            {total > 0 && completionRate >= 40 && completionRate < 80 && <p style={{ color: '#eab308' }}>Steady Progress: Your academic velocity is consistent. Aim for higher completion rates.</p>}
                            {total > 0 && completionRate >= 80 && <p style={{ color: '#22c55e' }}>Peak Performance: Exceptional throughput detected. You are operating at maximum efficiency 🔥</p>}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Productivity;
