import React from 'react';

export const GlassCard = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div 
      className={`glass-panel ${glow ? 'hover:shadow-[0_0_20px_rgba(57,209,220,0.2)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlowButton = ({ children, className = '', variant = 'primary', ...props }) => {
  return (
    <button 
      className={`glow-btn ${variant === 'secondary' ? 'opacity-90' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const NeonBadge = ({ children, color = 'primary', className = '', ...props }) => {
  const colorStyles = {
    primary: { background: 'rgba(57, 209, 220, 0.1)', color: '#39D1DC', border: 'rgba(57, 209, 220, 0.2)' },
    secondary: { background: 'rgba(237, 128, 253, 0.1)', color: '#ED80FD', border: 'rgba(237, 128, 253, 0.2)' },
    success: { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
    warning: { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: 'rgba(234, 179, 8, 0.2)' },
    danger: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
  };

  const style = colorStyles[color] || colorStyles.primary;

  return (
    <span 
      className={`neon-badge ${className}`}
      style={{
        backgroundColor: style.background,
        color: style.color,
        borderColor: style.border
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export const GradientText = ({ children, className = '', ...props }) => {
  return (
    <span className={`gradient-text ${className}`} {...props}>
      {children}
    </span>
  );
};
