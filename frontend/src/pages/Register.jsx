import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import { User, Mail, Lock, UserPlus, Loader2, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'student' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. System rejected identity initialization.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <GlassCard className="register-matrix-card" style={styles.card}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                            Join <GradientText>⚡ FocusFlow</GradientText>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', letterSpacing: '1px' }}>
                            IDENTITY INITIALIZATION
                        </p>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                style={styles.error}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="error-alert"
                            >
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div className="input-group-v2">
                            <label className="input-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-icon-wrapper"><User size={18} /></div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="John Doe" 
                                    className="form-control-v2" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group-v2">
                            <label className="input-label">Identity Email</label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-icon-wrapper"><Mail size={18} /></div>
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="john@example.edu" 
                                    className="form-control-v2" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group-v2">
                            <label className="input-label">Select System Role</label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-icon-wrapper">
                                    {formData.role === 'student' && <GraduationCap size={18} />}
                                    {formData.role === 'teacher' && <Briefcase size={18} />}
                                    {formData.role === 'admin' && <ShieldCheck size={18} />}
                                </div>
                                <select 
                                    name="role" 
                                    className="form-control-v2 select-v2" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="student">Student 🎓</option>
                                    <option value="teacher">Teacher 👩‍🏫</option>
                                    <option value="admin">Admin 🛠️</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group-v2">
                            <label className="input-label">Security Key (Min 6 chars)</label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-icon-wrapper"><Lock size={18} /></div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    className="form-control-v2" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    minLength={6} 
                                />
                            </div>
                        </div>

                        <GlowButton type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> INITIALIZE IDENTITY</>}
                        </GlowButton>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            Operative exists? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '0.5rem' }}>Return to Login</Link>
                        </p>
                    </div>
                </GlassCard>
            </motion.div>

            <style>{`
                .input-group-v2 { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
                .input-label { font-size: 0.75rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-left: 0.5rem; }
                .input-icon-wrapper { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; transition: color 0.3s ease; z-index: 2; }
                .form-control-v2 { width: 100%; padding: 1rem 1.25rem 1rem 3.5rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 14px; color: white; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .form-control-v2:focus { background: rgba(255, 255, 255, 0.05); border-color: var(--primary); box-shadow: 0 0 20px rgba(57, 209, 220, 0.15); outline: none; }
                .form-control-v2:focus + .input-icon-wrapper { color: var(--primary); }
                .select-v2 { appearance: none; cursor: pointer; }
                .select-v2 option { background: #0f172a; color: white; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .error-alert { background: rgba(239, 68, 68, 0.1); color: #f87171; padding: 1rem; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 2rem; font-size: 0.85rem; text-align: center; }
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
        maxWidth: '500px',
        padding: '3.5rem 3rem',
        border: '1px solid var(--border-glass-bright)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    }
};

export default Register;
