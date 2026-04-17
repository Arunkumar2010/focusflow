import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error at FocusFlow App:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#020617',
                    padding: '2rem'
                }}>
                    <Card style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
                        <div style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 1.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <AlertTriangle size={40} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Something went wrong</h2>
                        <p style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: '1.6' }}>
                            We encountered a critical UI error. This usually happens when data is missing or a component fails to render correctly.
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={this.handleReload} 
                            style={{ width: '100%', gap: '0.75rem' }}
                        >
                            <RefreshCw size={18} /> Reload Application
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
