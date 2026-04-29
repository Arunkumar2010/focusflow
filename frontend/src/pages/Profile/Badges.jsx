import React from 'react';
import { GlassCard } from '../../components/ui/FuturisticUI';
import { Star, Award, Shield, Zap } from 'lucide-react';

const Badges = ({ completedTasks }) => {
    const badgeMilestones = [
        { id: 'starter', label: 'Starter', min: 1, icon: <Star size={18} />, color: '#94a3b8' },
        { id: 'consistent', label: 'Consistent', min: 10, icon: <Zap size={18} />, color: '#39d1dc' },
        { id: 'focused', label: 'Focused', min: 50, icon: <Shield size={18} />, color: '#a855f7' },
        { id: 'master', label: 'Master', min: 100, icon: <Award size={18} />, color: '#f59e0b' }
    ];

    const earnedBadges = badgeMilestones.filter(b => completedTasks >= b.min);

    return (
        <GlassCard style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={20} color="var(--primary)" /> UNLOCKED BADGES
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {badgeMilestones.map(badge => {
                    const isEarned = completedTasks >= badge.min;
                    return (
                        <div 
                            key={badge.id} 
                            style={{ 
                                padding: '10px 16px', 
                                borderRadius: '12px', 
                                background: isEarned ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                                border: `1px solid ${isEarned ? badge.color : 'rgba(255,255,255,0.05)'}`,
                                opacity: isEarned ? 1 : 0.2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s ease',
                                grayscale: isEarned ? 0 : 1
                            }}
                        >
                            <span style={{ color: isEarned ? badge.color : 'inherit' }}>{badge.icon}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{badge.label}</span>
                        </div>
                    );
                })}
            </div>
            {earnedBadges.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '1.5rem', textAlign: 'center' }}>
                    Initialize tasks to unlock operational badges.
                </p>
            )}
        </GlassCard>
    );
};

export default Badges;
