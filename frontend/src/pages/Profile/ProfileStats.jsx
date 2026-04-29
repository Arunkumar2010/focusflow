import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/FuturisticUI';

export const GlassMetric = ({ icon, label, value, color }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Simple count-up animation logic
        if (typeof value !== 'number') {
            setDisplayValue(value);
            return;
        }

        let start = 0;
        const end = parseInt(value);
        if (start === end) {
            setDisplayValue(value);
            return;
        }

        let totalDuration = 1000;
        let increment = end / (totalDuration / 16);
        
        const animate = () => {
            start += increment;
            if (start < end) {
                setDisplayValue(Math.floor(start));
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(end);
            }
        };

        animate();
    }, [value]);

    return (
        <GlassCard style={{ padding: '1.5rem', borderLeft: `3px solid ${color}` }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{displayValue}</div>
        </GlassCard>
    );
};

const ProfileStats = ({ stats, role }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {/* Stat blocks are rendered within StudentProfile/TeacherProfile */}
        </div>
    );
};

export default ProfileStats;
