const validateRegister = (data) => {
    const errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (data.password && data.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (data.role && !['student', 'teacher', 'admin'].includes(data.role)) {
        errors.role = 'Invalid role selected';
    }
    
    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

const validateLogin = (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = { validateRegister, validateLogin };
