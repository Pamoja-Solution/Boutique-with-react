import React from 'react';

export default function SelectInput({ id, value, onChange, className = '', children, ...props }) {
    return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            className={`select select-bordered w-full ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}