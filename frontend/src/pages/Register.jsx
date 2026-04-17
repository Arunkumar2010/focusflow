import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="glass-card animate-fade-in">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-color)' }}>Create Account</h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-control" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password (Min 6 characters)</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-control" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Select Role</label>
                        <select 
                            name="role" 
                            className="form-control" 
                            value={formData.role} 
                            onChange={handleChange}
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)'
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem'
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger-color)',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        border: '1px solid var(--danger-color)',
        textAlign: 'center'
    }
};

export default Register;
