import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, required, className = '', style, as = 'input', children, rows }) => {
    
    // Support for textarea and select through 'as' prop
    if (as === 'textarea') {
        return (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`form-control ${className}`}
                style={style}
                rows={rows || 3}
            />
        );
    }

    if (as === 'select') {
        return (
            <div className={`select-wrapper ${className}`}>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="form-control"
                    style={style}
                >
                    {children}
                </select>
            </div>
        );
    }

    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`form-control ${className}`}
            style={style}
        />
    );
};

export default Input;
