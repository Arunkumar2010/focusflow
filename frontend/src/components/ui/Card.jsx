import React, { forwardRef } from 'react';

const Card = forwardRef(({ children, className = '', style, onClick }, ref) => {
    return (
        <div 
            ref={ref}
            className={`card ${className}`} 
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
});

export default Card;

