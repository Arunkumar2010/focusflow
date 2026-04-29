import React from 'react';
import { GlassCard } from '../../components/ui/FuturisticUI';

const XPProgress = ({ xp }) => {
    const level = Math.floor(xp / 100);
    const progress = xp % 100;
    const nextLevelXP = 100;

    return (
        <GlassCard style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.5rem' }}>LEVEL RANK</h4>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Level {level}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>XP {xp}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}> / {(level + 1) * 100}</span>
                </div>
            </div>
            
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                <div 
                    style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: 'var(--accent-gradient)', 
                        boxShadow: '0 0 20px var(--primary)',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                    }} 
                />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {100 - progress} XP remaining until Level {level + 1}
            </p>
        </GlassCard>
    );
};

export default XPProgress;
