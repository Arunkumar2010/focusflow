import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import { User, Mail, Lock, Shield, UserPlus, GraduationCap, Users, ShieldAlert, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRoleSelect = (role) => setFormData({ ...formData, role });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration sequence failed.');
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (formData.name && formData.email && formData.password.length >= 6) {
            setStep(2);
        } else {
            setError('Please complete all fields correctly.');
        }
    };

    const prevStep = () => setStep(1);

    const roles = [
        { id: 'student', title: 'Student', icon: <GraduationCap size={24} />, desc: 'Access tasks & classes' },
        { id: 'teacher', title: 'Educator', icon: <Users size={24} />, desc: 'Manage batches & students' },
        { id: 'admin', title: 'Admin', icon: <ShieldAlert size={24} />, desc: 'System governance' }
    ];

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <GlassCard className="register-matrix-card" style={styles.card}>
                    {/* Progress Bar */}
                    <div className="registration-progress">
                        <motion.div 
                            className="progress-fill"
                            animate={{ width: step === 1 ? '50%' : '100%' }}
                        ></motion.div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                            Join <GradientText>⚡ FocusFlow</GradientText>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', letterSpacing: '1px' }}>
                            {step === 1 ? 'IDENTITY INITIALIZATION' : 'ACCESS PARAMETERS'}
                        </p>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                style={styles.error}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <form onSubmit={handleSubmit} style={{ position: 'relative', overflow: 'hidden', minHeight: '320px' }}>
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <div className="input-group-v2">
                                        <label className="input-label">Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <div className="input-icon-wrapper"><User size={18} /></div>
                                            <input type="text" name="name" placeholder="John Doe" className="form-control-v2" value={formData.name} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="input-group-v2">
                                        <label className="input-label">Identity Email</label>
                                        <div style={{ position: 'relative' }}>
                                            <div className="input-icon-wrapper"><Mail size={18} /></div>
                                            <input type="email" name="email" placeholder="john@example.edu" className="form-control-v2" value={formData.email} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="input-group-v2">
                                        <label className="input-label">Security Key (Min 6 chars)</label>
                                        <div style={{ position: 'relative' }}>
                                            <div className="input-icon-wrapper"><Lock size={18} /></div>
                                            <input type="password" name="password" placeholder="••••••••" className="form-control-v2" value={formData.password} onChange={handleChange} required minLength={6} />
                                        </div>
                                    </div>
                                    <GlowButton type="button" onClick={nextStep} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                        Next Phase <ChevronRight size={18} />
                                    </GlowButton>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <label className="input-label">Select System Role</label>
                                    <div className="role-selector-v2">
                                        {roles.map((role) => (
                                            <motion.div
                                                key={role.id}
                                                className={`role-card-v2 ${formData.role === role.id ? 'active' : ''}`}
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="role-card-icon">{role.icon}</div>
                                                <div className="role-card-info">
                                                    <h4>{role.title}</h4>
                                                    <p>{role.desc}</p>
                                                </div>
                                                {formData.role === role.id && (
                                                    <motion.div className="role-check" layoutId="role-check">
                                                        <Shield size={16} />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={prevStep} className="btn-back">
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <GlowButton type="submit" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> INITIALIZE IDENTITY</>}
                                        </GlowButton>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            Operative exists? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '0.5rem' }}>Return to Login</Link>
                        </p>
                    </div>
                </GlassCard>
            </motion.div>

            <style>{`
                .registration-progress {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.05);
                }
                .progress-fill {
                    height: 100%;
                    background: var(--accent-gradient);
                    box-shadow: 0 0 10px var(--primary);
                }
                .role-selector-v2 {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .role-card-v2 {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-glass);
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .role-card-v2.active {
                    background: rgba(57, 209, 220, 0.08);
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(57, 209, 220, 0.1);
                }
                .role-card-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .role-card-v2.active .role-card-icon {
                    background: var(--primary);
                    color: white;
                }
                .role-card-info h4 {
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }
                .role-card-info p {
                    font-size: 0.8rem;
                    color: var(--text-dim);
                }
                .role-check {
                    position: absolute;
                    right: 1.25rem;
                    color: var(--primary);
                }
                .btn-back {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    border-radius: var(--radius-sm);
                    color: var(--text-main);
                    padding: 0 1.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-back:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--text-dim);
                }
                .input-group-v2 { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-label { font-size: 0.75rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-left: 0.5rem; }
                .input-icon-wrapper { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; transition: color 0.3s ease; z-index: 2; }
                .form-control-v2 { width: 100%; padding: 1rem 1.25rem 1rem 3.5rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 14px; color: white; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .form-control-v2:focus { background: rgba(255, 255, 255, 0.05); border-color: var(--primary); box-shadow: 0 0 20px rgba(57, 209, 220, 0.15); outline: none; }
                .form-control-v2:focus + .input-icon-wrapper { color: var(--primary); }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem'
    },
    card: {
        width: '100%',
        maxWidth: '520px',
        padding: '3.5rem 3rem',
        border: '1px solid var(--border-glass-bright)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        marginBottom: '2rem',
        fontSize: '0.85rem',
        textAlign: 'center'
    }
};

export default Register;
