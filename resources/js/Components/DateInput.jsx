import React from 'react';

export default function DateInput({ id, value, onChange, className = '', ...props }) {
    return (
        <input
            id={id}
            type="date"
            value={value}
            onChange={onChange}
            className={`input input-bordered w-full ${className}`}
            {...props}
        />
    );
}