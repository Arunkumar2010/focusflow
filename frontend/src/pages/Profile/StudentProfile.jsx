import React from 'react';
import { Target, Activity } from 'lucide-react';
import StudentProfileExtras from './StudentProfile'; // Self reference? No, I am editing StudentProfile.jsx
import { GlassCard } from '../../components/ui/FuturisticUI';
import AchievementBoard from '../../components/AchievementBoard';
import { GlassMetric } from './ProfileStats';
import XPProgress from './XPProgress';
import Badges from './Badges';

const StudentProfile = ({ stats, badges, xp }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* 🏅 XP & LEVEL SYSTEM */}
            <XPProgress xp={xp} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <GlassMetric 
                    icon={<Target size={20} />} 
                    label="MISSION SUCCESS" 
                    value={stats?.completedTasks || 0} 
                    color="#22c55e" 
                />
                <GlassMetric 
                    icon={<Activity size={20} />} 
                    label="TOTAL OPERATIONS" 
                    value={stats?.totalTasks || 0} 
                    color="var(--primary)" 
                />
            </div>

            {/* 🛡️ BADGE SYSTEM */}
            <Badges completedTasks={stats?.completedTasks || 0} />
        </div>
    );
};

export default StudentProfile;
