import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, BookOpen, Clock, Zap, Sparkles } from 'lucide-react';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import '../styles/timer.css';

const StudyTimer = () => {
    const [mode, setMode] = useState('focus');
    const [duration, setDuration] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [focusTimeToday, setFocusTimeToday] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            clearInterval(timerRef.current);
            handleSessionComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleSessionComplete = () => {
        setIsActive(false);
        if (mode === 'focus') {
            setSessionsCompleted(prev => prev + 1);
            setFocusTimeToday(prev => prev + Math.floor(duration / 60));
            setMode('break');
            setDuration(5 * 60);
            setTimeLeft(5 * 60);
        } else {
            setMode('focus');
            setDuration(25 * 60);
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        const newDuration = newMode === 'focus' ? 25 * 60 : 5 * 60;
        setDuration(newDuration);
        setTimeLeft(newDuration);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = ((duration - timeLeft) / duration) * 100;
    const currentThemeColor = mode === 'focus' ? '#39D1DC' : '#22c55e';

    return (
        <div className="page-container timer-page">
            <div className="animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Focus <GradientText>Engine</GradientText>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Deep work synchronization for maximum intellectual throughput.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                    <GlassCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(57, 209, 220, 0.1)', padding: '10px', borderRadius: '12px' }}>
                            <BookOpen size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '1px' }}>SESSIONS COMPLETED</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{sessionsCompleted}</div>
                        </div>
                    </GlassCard>
                    <GlassCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(237, 128, 253, 0.1)', padding: '10px', borderRadius: '12px' }}>
                            <Clock size={20} color="var(--secondary)" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '1px' }}>TOTAL FOCUS TIME</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{focusTimeToday} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>MINS</span></div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border-glass-bright)', position: 'relative', overflow: 'hidden' }}>
                    {/* Background Glow */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${currentThemeColor}22 0%, transparent 70%)`,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                            <button 
                                className={`timer-mode-btn ${mode === 'focus' ? 'active' : ''}`}
                                onClick={() => switchMode('focus')}
                                style={mode === 'focus' ? { borderColor: 'var(--primary)', color: 'var(--primary)', background: 'rgba(57, 209, 220, 0.05)' } : {}}
                            >
                                FOCUS MODE
                            </button>
                            <button 
                                className={`timer-mode-btn ${mode === 'break' ? 'active' : ''}`}
                                onClick={() => switchMode('break')}
                                style={mode === 'break' ? { borderColor: '#22c55e', color: '#22c55e', background: 'rgba(34, 197, 94, 0.05)' } : {}}
                            >
                                RECHARGE BREAK
                            </button>
                        </div>

                        <div style={{ width: '280px', margin: '0 auto 3rem', position: 'relative' }}>
                            <div className={`timer-ring-glow ${isActive ? 'spinning' : ''}`} style={{ borderColor: currentThemeColor }}></div>
                            <CircularProgressbar
                                value={progress}
                                text={formatTime(timeLeft)}
                                strokeWidth={3}
                                styles={buildStyles({
                                    rotation: 0,
                                    strokeLinecap: 'round',
                                    textSize: '22px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: currentThemeColor,
                                    textColor: 'var(--text-main)',
                                    trailColor: 'rgba(255,255,255,0.03)',
                                    backgroundColor: 'transparent',
                                })}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                            <button onClick={resetTimer} style={styles.controlBtn}>
                                <RotateCcw size={24} />
                            </button>
                            <button 
                                onClick={toggleTimer}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: currentThemeColor,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: `0 0 30px ${currentThemeColor}44`,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {isActive ? <Pause size={32} color="white" /> : <Play size={32} color="white" style={{ marginLeft: '4px' }} />}
                            </button>
                            <button style={styles.controlBtn}>
                                <SettingsIcon size={24} />
                            </button>
                        </div>
                    </div>
                </GlassCard>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <NeonBadge color={mode === 'focus' ? 'primary' : 'success'}>
                        <Zap size={12} style={{ marginRight: '6px' }} />
                        {mode === 'focus' ? 'CONCENTRATION MODE ACTIVE' : 'REGENERATION SEQUENCE INITIALIZED'}
                    </NeonBadge>
                </div>
            </div>
        </div>
    );
};

const styles = {
    controlBtn: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-muted)',
        width: '50px',
        height: '50px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    }
};

export default StudyTimer;
