import React from 'react';
import AchievementBadge from './AchievementBadge';
import { Target } from 'lucide-react';

const MILESTONES = [
    { target: 1, name: 'Starter Badge' },
    { target: 5, name: 'Productivity Beginner' },
    { target: 10, name: 'Focus Master' },
    { target: 25, name: 'Task Champion' },
    { target: 50, name: 'Productivity Legend' }
];

const AchievementBoard = ({ completedTasks = 0, earnedBadges = [] }) => {
    // Determine the next milestone
    const nextMilestone = MILESTONES.find(m => completedTasks < m.target) || MILESTONES[MILESTONES.length - 1];
    
    // Calculate progress percentage
    let progressPercentage = 100;
    if (completedTasks < nextMilestone.target) {
        // Find previous milestone to calculate relative progress if needed, but absolute is easier:
        progressPercentage = Math.round((completedTasks / nextMilestone.target) * 100);
    }

    return (
        <div className="glass-card" style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <Target size={20} color="var(--accent-color)" />
                    Achievement Journey
                </h3>
            </div>

            <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                    <span style={styles.progressTitle}>Next Unlock: {nextMilestone.name}</span>
                    <span style={styles.progressText}>{completedTasks} / {nextMilestone.target} Tasks</span>
                </div>
                <div style={styles.progressBarBg}>
                    <div 
                        style={{
                            ...styles.progressBarFill, 
                            width: `${progressPercentage}%`,
                            background: 'var(--accent-gradient)'
                        }}
                    ></div>
                </div>
            </div>

            <div style={styles.badgesGrid}>
                {MILESTONES.map((milestone) => {
                    const isUnlocked = earnedBadges.includes(milestone.name) || completedTasks >= milestone.target;
                    return (
                        <AchievementBadge 
                            key={milestone.target}
                            badgeName={milestone.name}
                            locked={!isUnlocked}
                            showAnimation={isUnlocked}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-primary)'
    },
    progressSection: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
    },
    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    progressTitle: {
        color: 'var(--text-primary)'
    },
    progressText: {
        color: 'var(--accent-color)',
        fontWeight: 'bold'
    },
    progressBarBg: {
        height: '8px',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 1s ease-in-out'
    },
    badgesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'flex-start'
    }
};

export default AchievementBoard;
