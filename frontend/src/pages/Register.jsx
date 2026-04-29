import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, GlowButton, GradientText } from '../components/ui/FuturisticUI';
import { User, Mail, Lock, Shield, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration sequence failed.');
        }
    };

    return (
        <div style={styles.container}>
            <GlassCard className="animate-in" style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Join <GradientText>⚡ FocusFlow</GradientText>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>✨ Initialize New Identity</p>
                </div>
                
                {error && (
                    <div style={styles.error} className="animate-in">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={styles.icon} />
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Full Name"
                            className="form-control input-glow" 
                            style={styles.input}
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
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
                            placeholder="Secure Password"
                            className="form-control input-glow" 
                            style={styles.input}
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            minLength={6}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Shield size={18} style={styles.icon} />
                        <select 
                            name="role" 
                            className="form-control input-glow" 
                            style={{ ...styles.input, appearance: 'none' }}
                            value={formData.role} 
                            onChange={handleChange}
                        >
                            <option value="student">🎓 Student Account</option>
                            <option value="teacher">🧑‍🏫 Educator Account</option>
                            <option value="admin">🛡️ Administrator</option>
                        </select>
                    </div>
                    <GlowButton type="submit" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                        🚀 Initialize Account
                    </GlowButton>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Identity exists? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Return to Login</Link>
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
        maxWidth: '460px',
        padding: '3rem 2.5rem',
        border: '1px solid var(--border-glass-bright)'
    },
    icon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-dim)',
        pointerEvents: 'none',
        zIndex: 2
    },
    input: {
        paddingLeft: '3rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-glass)',
        fontSize: '0.95rem'
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

export default Register;
