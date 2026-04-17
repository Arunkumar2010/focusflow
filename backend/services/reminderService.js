// In a real world app, this might hook into node-cron and nodemailer
const checkDeadlines = async (tasks) => {
    const now = new Date();
    const upcomingDeadlines = tasks.filter(task => {
        if (task.status === 'Completed') return false;
        
        const deadline = new Date(task.deadline);
        // within 24 hours
        const diffTime = Math.abs(deadline - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 1;
    });

    return upcomingDeadlines;
};

module.exports = { checkDeadlines };
