import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import taskService from '../services/taskService';
import productivityService from '../services/productivityService';
import batchService from '../services/batchService';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, CheckCircle, BarChart2, Edit3, Image as ImageIcon, Book, GraduationCap, Award, Users, BookOpen, Clock } from 'lucide-react';
import AchievementBadge from '../components/AchievementBadge';
import AchievementBoard from '../components/AchievementBoard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import '../styles/profile.css';

const Profile = () => {
    const { user: authUser, logout } = useAuth();
    const role = authUser?.role || 'student';
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ 
        totalTasks: 0, 
        completedTasks: 0, 
        score: 0,
        totalBatches: 0,
        totalStudents: 0,
        upcomingClasses: 0,
        totalAssignments: 0
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePicture: '',
        university: '',
        department: '',
        yearOfStudy: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                
                // Common profile fetch
                const profRes = await userService.getProfile();
                const userData = profRes.data || profRes;
                setProfile(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '',
                    profilePicture: userData.profilePicture || '',
                    university: userData.university || '',
                    department: userData.department || '',
                    yearOfStudy: userData.yearOfStudy || '',
                    bio: userData.bio || ''
                });

                // Role-based analytics fetch
                if (role === 'teacher') {
                    const analyticsRes = await batchService.getTeacherAnalytics();
                    const analytics = analyticsRes.data || analyticsRes;
                    setStats({
                        totalBatches: analytics.totalBatches || 0,
                        totalStudents: analytics.totalStudents || 0,
                        upcomingClasses: analytics.upcomingClasses || 0,
                        totalAssignments: analytics.totalAssignments || 0
                    });
                } else {
                    const [taskRes, prodRes] = await Promise.all([
                        taskService.getTasks(),
                        productivityService.getTodayProductivity()
                    ]);

                    const tasks = taskRes.data || [];
                    const completed = tasks.filter(t => t.status === 'Completed').length;
                    
                    setStats({
                        totalTasks: tasks.length,
                        completedTasks: completed,
                        score: prodRes.data?.productivityScore || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                profilePicture: formData.profilePicture,
                university: formData.university,
                department: formData.department,
                yearOfStudy: formData.yearOfStudy,
                bio: formData.bio
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await userService.updateProfile(updateData);
            setProfile(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;

    const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="animate-fade-in page-container">
            <div>
                <header className="profile-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="profile-title">{role === 'teacher' ? 'Teacher Profile' : 'Student Profile'}</h1>
                            <p className="profile-subtitle">
                                {role === 'teacher' 
                                    ? 'Manage your teaching profile and batches.' 
                                    : 'Manage your academic information and showcase your achievements.'}
                            </p>
                        </div>
                        <span className="role-badge" style={{ 
                            background: 'var(--accent-color)', 
                            color: 'white', 
                            padding: '0.4rem 1rem', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            {role.toUpperCase()}
                        </span>
                    </div>
                </header>

                <div className="profile-grid">
                    {/* Left Column: Summary Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <Card className="profile-card floating-widget">
                            <div className="profile-avatar-section">
                                {profile?.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" className="profile-avatar-img" />
                                ) : (
                                    <div className="profile-avatar-placeholder">{initials}</div>
                                )}
                                <h2 className="profile-name">{profile?.name}</h2>
                                <p className="profile-role">
                                    {role === 'teacher' ? 'FOCUSFLOW TEACHER' : (profile?.department || 'FOCUSFLOW STUDENT')}
                                </p>
                                {profile?.bio && <p className="profile-bio">"{profile.bio}"</p>}
                            </div>

                            <div className="profile-info-list">
                                <div className="profile-info-item">
                                    <Mail size={18} color="var(--accent-color)" />
                                    <span><strong>Email:</strong> {profile?.email}</span>
                                </div>
                                {(profile?.university || profile?.department || profile?.yearOfStudy) && (
                                    <div className="profile-info-item align-start">
                                        <Book size={18} color="var(--accent-color)" style={{marginTop:'3px'}} />
                                        <span>
                                            <strong>Academics:</strong><br />
                                            {profile?.university && <>{profile.university}<br/></>}
                                            {profile?.department && <>{profile.department}<br/></>}
                                            {profile?.yearOfStudy && <span style={{color: 'var(--text-secondary)'}}>Year {profile.yearOfStudy}</span>}
                                        </span>
                                    </div>
                                )}
                                <div className="profile-info-item">
                                    <Calendar size={18} color="var(--accent-color)" />
                                    <span><strong>Joined:</strong> {new Date(profile?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                             <hr className="profile-divider" />

                            {role === 'teacher' ? (
                                <>
                                    <h3 className="profile-stats-heading">Teaching Stats</h3>
                                    <div className="profile-info-list">
                                        <div className="profile-info-item">
                                            <Users size={18} color="var(--accent-color)" />
                                            <span><strong>Total Batches:</strong> {stats.totalBatches}</span>
                                        </div>
                                        <div className="profile-info-item">
                                            <Users size={18} color="var(--success-color)" />
                                            <span><strong>Total Students:</strong> {stats.totalStudents}</span>
                                        </div>
                                        <div className="profile-info-item">
                                            <Clock size={18} color="var(--warning-color)" />
                                            <span><strong>Upcoming Classes:</strong> {stats.upcomingClasses}</span>
                                        </div>
                                        <div className="profile-info-item">
                                            <BookOpen size={18} color="var(--accent-color)" />
                                            <span><strong>Total Assignments:</strong> {stats.totalAssignments}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="profile-stats-heading">Productivity Stats</h3>
                                    <div className="profile-info-list">
                                        <div className="profile-info-item">
                                            <CheckCircle size={18} color="var(--success-color)" />
                                            <span><strong>Completed Tasks:</strong> {stats.completedTasks}</span>
                                        </div>
                                        <div className="profile-info-item">
                                            <BarChart2 size={18} color="var(--warning-color)" />
                                            <span><strong>Total Tasks Created:</strong> {stats.totalTasks}</span>
                                        </div>
                                        <div className="profile-info-item">
                                            <BarChart2 size={18} color="var(--accent-color)" />
                                            <span><strong>Today's Score:</strong> {stats.score}%</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                        
                        {/* Badges Section - Only for students */}
                        {role === 'student' && (
                            <div style={{ marginTop: '1rem' }}>
                                <AchievementBoard 
                                    completedTasks={stats.completedTasks} 
                                    earnedBadges={profile?.badges || []} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Edit Form */}
                    <Card className="profile-card">
                        <div className="profile-form-header">
                            <h2 className="profile-form-title">Edit Profile Focus</h2>
                            <button 
                                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`} 
                                onClick={() => setIsEditing(!isEditing)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Edit3 size={16} />
                                {isEditing ? 'Cancel' : 'Edit Mode'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="profile-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Bio (Short description)</label>
                                    <Input as="textarea" name="bio" rows="2" value={formData.bio} onChange={handleInputChange} placeholder={role === 'teacher' ? "Teaching philosophy..." : "Academic goals..."} />
                                </div>
                                
                                <div className="profile-form-grid">
                                    <div className="form-group">
                                        <label>{role === 'teacher' ? 'Institution' : 'University'}</label>
                                        <Input type="text" name="university" value={formData.university} onChange={handleInputChange} placeholder="e.g. MIT" />
                                    </div>
                                    <div className="form-group">
                                        <label>{role === 'teacher' ? 'Subject / Domain' : 'Department / Major'}</label>
                                        <Input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Computer Science" />
                                    </div>
                                </div>
                                {role === 'student' && (
                                    <div className="form-group">
                                        <label>Year of Study</label>
                                        <Input type="text" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange} placeholder="e.g. Sophomore, Year 3" />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Profile Picture URL</label>
                                    <div style={{ position: 'relative' }}>
                                        <ImageIcon size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
                                        <Input type="text" name="profilePicture" style={{ paddingLeft: '2.5rem' }} value={formData.profilePicture} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleInputChange} minLength="6" placeholder="Leave blank to keep current" />
                                </div>
                                <Button type="submit" variant="primary" style={{ marginTop: '1rem', width: '100%' }}>
                                    Save Profile Data
                                </Button>
                            </form>
                        ) : (
                            <div className="profile-readonly-container">
                                {role === 'teacher' ? <BookOpen size={48} color="var(--accent-color)" style={{ opacity: 0.5, marginBottom: '1rem' }} /> : <GraduationCap size={48} color="var(--accent-color)" style={{ opacity: 0.5, marginBottom: '1rem' }} />}
                                <h3 className="profile-readonly-title">{role === 'teacher' ? 'Teaching Profile Locked' : 'Academic Profile Locked'}</h3>
                                <p className="profile-readonly-text">
                                    {role === 'teacher' 
                                        ? 'Click the "Edit Mode" button to update your teaching details and batch management.' 
                                        : 'Click the "Edit Mode" button to update your identity, academic parameters, and avatar configurations.'}
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
