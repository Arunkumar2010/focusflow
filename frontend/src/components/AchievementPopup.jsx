import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, X } from 'lucide-react';

const AchievementPopup = ({ achievement, onClose }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
            setTimeout(onClose, 500); // Close shortly after confetti stops
        }, 5000); // Show for 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={styles.popupContainer}
                className="glass-card"
            >
                {showConfetti && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
                        <Confetti width={400} height={200} recycle={false} numberOfPieces={200} />
                    </div>
                )}
                
                <button onClick={onClose} style={styles.closeBtn}>
                    <X size={16} />
                </button>

                <div style={styles.content}>
                    <div style={styles.iconContainer}>
                        <img src={achievement.badgeIcon} alt={achievement.badgeName} style={styles.icon} />
                    </div>
                    <div style={styles.textContainer}>
                        <div style={styles.header}>
                            <Trophy size={14} color="var(--accent-color)" />
                            <span style={styles.headerText}>Achievement Unlocked!</span>
                        </div>
                        <h3 style={styles.title}>{achievement.badgeName}</h3>
                        <p style={styles.description}>{achievement.description}</p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const styles = {
    popupContainer: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '350px',
        padding: '1.25rem',
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderTop: '2px solid var(--accent-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.2)',
        zIndex: 9999,
        overflow: 'hidden'
    },
    closeBtn: {
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        zIndex: 10
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative',
        zIndex: 2
    },
    iconContainer: {
        width: '70px',
        height: '70px',
        flexShrink: 0,
        borderRadius: '50%',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px'
    },
    icon: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    textContainer: {
        flex: 1
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        marginBottom: '0.25rem'
    },
    headerText: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--accent-color)'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 0 0.25rem 0'
    },
    description: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: 1.3
    }
};

export default AchievementPopup;
