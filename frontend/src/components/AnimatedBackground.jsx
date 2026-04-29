import React, { useEffect, useRef, useState } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ children }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (!isMoving) setIsMoving(true);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isMoving]);

    // Create floating particles with higher count and more variation
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        size: Math.random() * 6 + 2, // Larger particles for visibility
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 5 // Faster movement
    }));

    // Create blurring blobs with more distinct colors
    const blobs = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 500 + 400,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 15 + 10, // Faster
        delay: Math.random() * 10
    }));

    return (
        <>
            {/* FIXED BACKGROUND LAYERS */}
            <div className="futuristic-bg-canvas">
                {/* Base Animated Gradient */}
                <div className="animated-gradient-base"></div>

                {/* Mouse Follow Glow - High Visibility */}
                <div 
                    className="mouse-follow-glow" 
                    style={{ 
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        opacity: isMoving ? 1 : 0
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

                {/* Grid Overlay */}
                <div className="bg-grid-overlay"></div>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="app-content-root">
                {children}
            </div>
        </>
    );
};

export default AnimatedBackground;
