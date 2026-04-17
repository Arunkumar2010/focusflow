export const formatDeadline = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const isApproaching = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const now = new Date();
    
    // Check if deadline is within next 48 hours
    const diffTime = deadline - now;
    const diffHours = diffTime / (1000 * 60 * 60);
    
    return diffHours > 0 && diffHours <= 48;
};

export const isOverdue = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const now = new Date();
    return deadline < now;
};
