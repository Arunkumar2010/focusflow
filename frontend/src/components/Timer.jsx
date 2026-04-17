import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, Coffee } from 'lucide-react';
import '../styles/timer.css';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus or break

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Audio alert could go here
            setIsActive(false);
            if(mode === 'focus') {
                setMode('break');
                setTimeLeft(5 * 60); // 5 min break
            } else {
                setMode('focus');
                setTimeLeft(25 * 60); // 25 min focus
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 100 - (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

    return (
        <div className="widget-timer-card glass-card">
            <h3 className="widget-timer-header">Study Timer</h3>
            
            <div className="widget-timer-tabs">
                <button 
                    className={`widget-timer-tab ${mode === 'focus' ? 'focus-active' : ''}`}
                    onClick={() => switchMode('focus')}
                >
                    <Brain size={16} /> Focus
                </button>
                <button 
                    className={`widget-timer-tab ${mode === 'break' ? 'break-active' : ''}`}
                    onClick={() => switchMode('break')}
                >
                    <Coffee size={16} /> Break
                </button>
            </div>

            <div className="widget-timer-circle">
                {/* Simple SVG progress ring */}
                <svg width="200" height="200" className="widget-timer-svg">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                    <circle 
                        cx="100" cy="100" r="90" fill="none" 
                        stroke={mode === 'focus' ? 'var(--accent-color)' : 'var(--success-color)'} 
                        strokeWidth="8" 
                        strokeDasharray="565.48" 
                        strokeDashoffset={565.48 - (progress / 100) * 565.48}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="widget-timer-time">{formatTime(timeLeft)}</div>
            </div>

            <div className="widget-timer-controls">
                <button onClick={toggleTimer} className="widget-timer-play-btn">
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={resetTimer} className="widget-timer-reset-btn">
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

export default Timer;
