import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AchievementProvider } from './context/AchievementContext';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Productivity from './pages/Productivity';
import Profile from './pages/Profile';
import StudyTimer from './pages/StudyTimer';
import Settings from './pages/Settings';
import Batches from './pages/Batches';
import BatchDetails from './pages/BatchDetails';
import LiveClasses from './pages/LiveClasses';
import StudentClasses from './pages/StudentClasses';
import Assignments from './pages/Assignments';
import './styles/App.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    
    return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <AppLayout>
                        <Dashboard />
                    </AppLayout>
                </PrivateRoute>
            } />
                
                <Route path="/tasks" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Tasks />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/batches" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Batches />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/batches/:id" element={
                    <PrivateRoute>
                        <AppLayout>
                            <BatchDetails />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/classes" element={
                    <PrivateRoute>
                        <AppLayout>
                            <StudentClasses />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/schedule-class" element={
                    <PrivateRoute>
                        <AppLayout>
                            <LiveClasses />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/assignments" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Assignments />
                        </AppLayout>
                    </PrivateRoute>
                } />
                
                <Route path="/productivity" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Productivity />
                        </AppLayout>
                    </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Profile />
                        </AppLayout>
                    </PrivateRoute>
                } />

                <Route path="/timer" element={
                    <PrivateRoute>
                        <AppLayout>
                            <StudyTimer />
                        </AppLayout>
                    </PrivateRoute>
                } />
                
                <Route path="/settings" element={
                    <PrivateRoute>
                        <AppLayout>
                            <Settings />
                        </AppLayout>
                    </PrivateRoute>
                } />
            </Routes>
    );
};

const App = () => {
    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty('--x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--y', `${e.clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <GlobalErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <AchievementProvider>
                        <BrowserRouter>
                        <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', color: 'var(--text-primary)' }}>
                            <Routes>
                                <Route path="/login" element={null} />
                                <Route path="/register" element={null} />
                                <Route path="*" element={<Navbar />} />
                            </Routes>
                            <AppRoutes />
                        </div>
                        </BrowserRouter>
                    </AchievementProvider>
                </AuthProvider>
            </ThemeProvider>
        </GlobalErrorBoundary>
    );
};

export default App;
