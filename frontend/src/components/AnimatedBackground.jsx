import React, { useEffect, useRef, useState } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ children }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const bgRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Create floating particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 10
    }));

    // Create blurring blobs
    const blobs = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        size: Math.random() * 400 + 300,
        left: Math.random() * 80,
        top: Math.random() * 80,
        duration: Math.random() * 30 + 20,
        delay: Math.random() * 5
    }));

    return (
        <div className="futuristic-bg-container" ref={bgRef}>
            {/* Base Animated Gradient */}
            <div className="animated-gradient-base"></div>

            {/* Mouse Follow Glow */}
            <div 
                className="mouse-follow-glow" 
                style={{ 
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)` 
                }}
            ></div>

            {/* Floating Blur Blobs */}
            {blobs.map(blob => (
                <div 
                    key={blob.id}
                    className="blur-blob"
                    style={{
                        width: `${blob.size}px`,
                        height: `${blob.size}px`,
                        left: `${blob.left}%`,
                        top: `${blob.top}%`,
                        animationDuration: `${blob.duration}s`,
                        animationDelay: `-${blob.delay}s`
                    }}
                ></div>
            ))}

            {/* Floating Particles */}
            <div className="particles-layer">
                {particles.map(p => (
                    <div 
                        key={p.id}
                        className="particle"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `-${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Grid Overlay for depth */}
            <div className="bg-grid-overlay"></div>

            {/* Page Content */}
            <div className="bg-content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;
