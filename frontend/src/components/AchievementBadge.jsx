import React from 'react';
import { Award, Zap, Star, Shield, Crown } from 'lucide-react';
import '../styles/App.css'; // For possible glassmorphism utility classes

const ICONS = {
    'Starter Badge': '/badges/starter.svg',
    'Productivity Beginner': '/badges/beginner.svg',
    'Focus Master': '/badges/focusmaster.svg',
    'Task Champion': '/badges/champion.svg',
    'Productivity Legend': '/badges/legend.svg'
};

const COLORS = {
    'Starter Badge': '#10b981', // green
    'Productivity Beginner': '#3b82f6', // blue
    'Focus Master': '#8b5cf6', // purple
    'Task Champion': '#f59e0b', // orange
    'Productivity Legend': '#ef4444' // red
};

const DEFAULT_COLOR = 'var(--text-secondary)';

const AchievementBadge = ({ badgeName, size = 'sm', showAnimation = false, locked = false }) => {
    const iconSrc = ICONS[badgeName];
    const color = COLORS[badgeName] || DEFAULT_COLOR;

    const badgeStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: size === 'lg' ? '1.5rem' : '0.75rem',
        borderRadius: 'var(--radius-lg)',
        background: locked ? 'var(--bg-secondary)' : `linear-gradient(135deg, ${color}22 0%, transparent 100%)`,
        border: locked ? '1px dashed var(--border-color)' : `1px solid ${color}44`,
        color: locked ? 'var(--text-secondary)' : color,
        textAlign: 'center',
        width: size === 'lg' ? '140px' : '100px',
        transition: 'all var(--transition-bounce)',
        cursor: 'default',
        boxShadow: locked ? 'none' : `0 4px 15px ${color}15`,
        opacity: locked ? 0.6 : 1,
        filter: locked ? 'grayscale(100%)' : 'none'
    };

    return (
        <div 
            className={`glass-card ${showAnimation && !locked ? 'animate-fade-in floating-widget' : ''}`} 
            style={badgeStyle}
            title={locked ? `Locked: ${badgeName}` : badgeName}
            onMouseEnter={(e) => {
                if(!locked) e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            }}
            onMouseLeave={(e) => {
                if(!locked) e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
        >
            <div style={{ 
                width: size === 'lg' ? '60px' : '40px', 
                height: size === 'lg' ? '60px' : '40px',
                padding: '0.5rem', 
                borderRadius: '50%', 
                background: locked ? 'var(--bg-color)' : `${color}33`, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {iconSrc ? (
                    <img src={iconSrc} alt={badgeName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    <Award size={size === 'lg' ? 32 : 24} />
                )}
            </div>
            <span style={{ fontSize: size === 'lg' ? '0.9rem' : '0.75rem', fontWeight: '600', lineHeight: '1.2' }}>
                {badgeName}
            </span>
        </div>
    );
};

export default AchievementBadge;
