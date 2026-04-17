import React, { createContext, useState, useContext } from 'react';
import AchievementPopup from '../components/AchievementPopup';

const AchievementContext = createContext();

export const useAchievement = () => useContext(AchievementContext);

export const AchievementProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [levelUpData, setLevelUpData] = useState(null);

    const triggerAchievements = (newAchievements) => {
        if (!newAchievements || newAchievements.length === 0) return;
        setAchievements((prev) => [...prev, ...newAchievements]);
    };

    const triggerLevelUp = (newLevel) => {
        setLevelUpData(newLevel);
    };

    const removeAchievement = (id) => {
        setAchievements((prev) => prev.filter((a) => a._id !== id));
    };

    return (
        <AchievementContext.Provider value={{ triggerAchievements, triggerLevelUp }}>
            {children}
            <div className="achievement-popup-container">
                {achievements.map((achievement, index) => (
                    <AchievementPopup 
                        key={achievement._id || index} 
                        achievement={achievement} 
                        onClose={() => removeAchievement(achievement._id)} 
                    />
                ))}
                
                {levelUpData && (
                    <AchievementPopup 
                        achievement={{
                            badgeName: `Level ${levelUpData} Reached!`,
                            badgeIcon: '/badges/focusmaster.svg',
                            description: 'You have leveled up! Keep crushing your tasks.'
                        }}
                        onClose={() => setLevelUpData(null)}
                    />
                )}
            </div>
        </AchievementContext.Provider>
    );
};
