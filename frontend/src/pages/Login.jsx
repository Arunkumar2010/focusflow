import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(formData);
            if (res.user.role === 'student' || res.user.role === 'teacher') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please verify your credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <GlassCard className="animate-in" style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        <GradientText>⚡ FocusFlow</GradientText>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure Portal Initialization</p>
                </div>
                
                {error && (
                    <div style={styles.error} className="animate-in">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={styles.icon} />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address"
                            className="form-control input-glow" 
                            style={styles.input}
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={styles.icon} />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password"
                            className="form-control input-glow" 
                            style={styles.input}
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <GlowButton type="submit" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                        <LogIn size={18} />
                        Authorize Access
                    </GlowButton>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    New explorer? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link>
                </p>
            </GlassCard>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '3rem 2.5rem',
        border: '1px solid var(--border-glass-bright)'
    },
    icon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-dim)',
        pointerEvents: 'none'
    },
    input: {
        paddingLeft: '3rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-glass)'
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        fontSize: '0.85rem',
        textAlign: 'center'
    }
};

export default Login;
