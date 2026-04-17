import React from 'react';

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled, style }) => {
    const baseClass = variant === 'primary' ? 'primary-btn' : variant === 'secondary' ? 'secondary-btn' : 'btn';
    
    return (
        <button 
            type={type}
            className={`${baseClass} ${className}`} 
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
