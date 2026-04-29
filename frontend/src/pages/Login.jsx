import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(formData);
            if (res.user.role === 'student' || res.user.role === 'teacher') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please verify your credentials.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
                <GlassCard className="login-matrix-card" style={styles.card}>
                    {/* Animated Glow Border */}
                    <div className="card-glow-border"></div>

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                                <GradientText>⚡ FocusFlow</GradientText>
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', letterSpacing: '1px' }}>
                                CORE SYSTEM ACCESS
                            </p>
                        </motion.div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                style={styles.error}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="error-alert"
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div className="input-group-v2">
                            <label className="input-label">Identity Email</label>
                            <div style={{ position: 'relative' }}>
                                <motion.div 
                                    className="input-icon-wrapper"
                                    whileFocus={{ color: 'var(--primary)' }}
                                >
                                    <Mail size={18} />
                                </motion.div>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="name@institution.edu"
                                    className="form-control-v2" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group-v2">
                            <label className="input-label">Security Key</label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    placeholder="••••••••"
                                    className="form-control-v2" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeBtn}
                                    className="eye-toggle"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'none' }}>
                                Recovery Sequence?
                            </Link>
                        </div>

                        <GlowButton 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', height: '56px' }}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>INITIALIZE SESSION</span>
                                </>
                            )}
                        </GlowButton>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            New Operative? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '0.5rem' }}>Initialize New Identity</Link>
                        </p>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Custom Styles Injection */}
            <style>{`
                .login-matrix-card {
                    position: relative;
                    overflow: hidden;
                }
                .card-glow-border {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent);
                    animation: flowBorder 3s infinite linear;
                }
                @keyframes flowBorder {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .input-group-v2 {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .input-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-left: 0.5rem;
                }
                .input-icon-wrapper {
                    position: absolute;
                    left: 1.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-dim);
                    pointer-events: none;
                    transition: color 0.3s ease;
                    z-index: 2;
                }
                .form-control-v2 {
                    width: 100%;
                    padding: 1rem 1.25rem 1rem 3.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-glass);
                    border-radius: 14px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .form-control-v2:focus {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(57, 209, 220, 0.15);
                    outline: none;
                }
                .form-control-v2:focus + .input-icon-wrapper,
                .form-control-v2:focus ~ .input-icon-wrapper {
                    color: var(--primary);
                }
                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    margin-bottom: 2rem;
                    font-size: 0.85rem;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
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
        maxWidth: '480px',
        padding: '3.5rem 3rem',
        border: '1px solid var(--border-glass-bright)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    eyeBtn: {
        position: 'absolute',
        right: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: 'var(--text-dim)',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.3s ease'
    }
};

export default Login;
