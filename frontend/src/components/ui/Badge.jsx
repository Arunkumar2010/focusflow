import React from 'react';

const Badge = ({ children, variant = 'gray', className = '', style }) => {
    let colorClass = '';
    switch(variant?.toLowerCase()) {
        case 'green':
        case 'ongoing':
        case 'completed':
            colorClass = 'badge-green';
            break;
        case 'yellow':
        case 'upcoming':
        case 'pending':
            colorClass = 'badge-yellow';
            break;
        case 'red':
        case 'closed':
        case 'overdue':
            colorClass = 'badge-red';
            break;
        default:
            colorClass = '';
            break;
    }

    return (
        <span className={`badge ${colorClass} ${className}`} style={style}>
            {children}
        </span>
    );
};

export default Badge;
