const validateTask = (data) => {
    const errors = {};
    if (!data.title) errors.title = 'Title is required';
    if (data.title && data.title.length > 50) errors.title = 'Title cannot exceed 50 characters';
    if (!data.description) errors.description = 'Description is required';
    if (!data.deadline) errors.deadline = 'Deadline is required';

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = { validateTask };
