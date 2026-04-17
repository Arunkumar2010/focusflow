const calculateProductivity = (completedTasks, pendingTasks) => {
    const totalJobs = completedTasks + pendingTasks;
    if (totalJobs === 0) return 0;
    
    return Math.round((completedTasks / totalJobs) * 100);
};

module.exports = { calculateProductivity };
