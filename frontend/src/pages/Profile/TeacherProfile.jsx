import React from 'react';
import { Users, Clock, Shield } from 'lucide-react';
import { GlassCard } from '../../components/ui/FuturisticUI';
import { GlassMetric } from './ProfileStats';

const TeacherProfile = ({ stats }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            <GlassMetric icon={<Users size={20} />} label="ACTIVE COHORTS" value={stats?.totalBatches || 0} color="var(--primary)" />
            <GlassMetric icon={<Users size={20} />} label="UNITS MANAGED" value={stats?.totalStudents || 0} color="#22c55e" />
            <GlassMetric icon={<Clock size={20} />} label="SESSION LOAD" value={stats?.upcomingClasses || 0} color="#eab308" />
        </div>

        <GlassCard style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>System Performance</h2>
            <div style={{ textAlign: 'center', padding: '3rem 2rem', opacity: 0.3 }}>
                <Shield size={64} style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontWeight: 800 }}>CORE ANALYTICS ACTIVE</h3>
                <p style={{ fontSize: '0.9rem' }}>Real-time synchronization with teaching cohorts.</p>
            </div>
        </GlassCard>
    </div>
);

export default TeacherProfile;
