import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, Coffee, BookOpen, Clock } from 'lucide-react';
import '../styles/timer.css';

const StudyTimer = () => {
    // Mode can be 'focus' or 'break'
    const [mode, setMode] = useState('focus');
    const [duration, setDuration] = useState(25 * 60); // 25 minutes default focus
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    
    // Stats
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [focusTimeToday, setFocusTimeToday] = useState(0); // in minutes

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
        // Play notification sound or logic here
        if (mode === 'focus') {
            setSessionsCompleted(prev => prev + 1);
            setFocusTimeToday(prev => prev + Math.floor(duration / 60));
            alert("Focus session complete! Time for a break.");
            setMode('break');
            setDuration(5 * 60);
            setTimeLeft(5 * 60);
        } else {
            alert("Break is over! Ready to focus?");
            setMode('focus');
            setDuration(25 * 60);
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

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
    const currentThemeColor = mode === 'focus' ? 'var(--accent-color)' : 'var(--success-color)';

    return (
        <div className="animate-fade-in study-timer-container">
            {/* Ambient Animated Background */}
            <div className="ambient-bg" style={{
                background: `radial-gradient(circle at 50% 50%, ${currentThemeColor}15 0%, var(--bg-color) 70%)`
            }}>
                {isActive && (
                    <div className="breathing-glow-circle" style={{
                        background: `radial-gradient(circle, ${currentThemeColor}22 0%, transparent 60%)`
                    }}></div>
                )}
            </div>

            <div className="study-timer-content">
                
                {/* Header Stats */}
                <div className="timer-stats-header">
                    <div className="glass-card timer-stat-chip">
                        <BookOpen size={16} color="var(--accent-color)" />
                        <div>
                            <span className="timer-stat-label">Sessions</span>
                            <div className="timer-stat-value">{sessionsCompleted}</div>
                        </div>
                    </div>
                    <div className="glass-card timer-stat-chip">
                        <Clock size={16} color="var(--warning-color)" />
                        <div>
                            <span className="timer-stat-label">Focus Time</span>
                            <div className="timer-stat-value">{focusTimeToday}m</div>
                        </div>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="glass-card timer-mode-selector">
                    <button 
                        className={`timer-mode-btn ${mode === 'focus' ? 'focus-active' : ''}`}
                        onClick={() => switchMode('focus')}
                    >
                        Focus Mode
                    </button>
                    <button 
                         className={`timer-mode-btn ${mode === 'break' ? 'break-active' : ''}`}
                        onClick={() => switchMode('break')}
                    >
                        Short Break
                    </button>
                </div>

                {/* Timer Display */}
                <div className="timer-display-wrapper">
                    <div className={`timer-glow-ring ${isActive ? 'active' : ''}`} style={{
                        background: `conic-gradient(from 0deg, transparent, ${currentThemeColor}44, transparent)`
                    }}></div>
                    
                    <CircularProgressbar
                        value={progress}
                        text={formatTime(timeLeft)}
                        strokeWidth={4}
                        styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: 'round',
                            textSize: '20px',
                            pathTransitionDuration: 0.5,
                            pathColor: currentThemeColor,
                            textColor: 'var(--text-primary)',
                            trailColor: 'rgba(255,255,255,0.05)',
                            backgroundColor: 'transparent',
                        })}
                    />
                </div>

                {/* Controls */}
                <div className="timer-controls">
                    <button className="glass-card timer-control-btn" onClick={resetTimer}>
                        <RotateCcw size={20} color="var(--text-secondary)" />
                    </button>
                    <button 
                        className="timer-play-btn"
                        style={{backgroundColor: currentThemeColor, boxShadow: `0 0 20px ${currentThemeColor}66`}} 
                        onClick={toggleTimer}
                    >
                        {isActive ? <Pause size={32} color="white" fill="white" /> : <Play size={32} color="white" fill="white" style={{marginLeft: '4px'}}/>}
                    </button>
                    <button className="glass-card timer-control-btn">
                        <SettingsIcon size={24} color="var(--text-secondary)" />
                    </button>
                </div>

                {/* Motivational Quote or Subtext */}
                <div className="glass-card timer-quote-box">
                    <p className="timer-quote-text">
                        {mode === 'focus' ? '"Deep work is the superpower of the 21st century."' : '"Relax and recharge."'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudyTimer;
