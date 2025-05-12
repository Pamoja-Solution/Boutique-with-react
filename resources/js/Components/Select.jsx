export default function Select({ label, className = '', children, ...props }) {
    return (
        <div className={`form-control ${className}`}>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <select
                className="select select-bordered w-full"
                {...props}
            >
                {children}
            </select>
            {props.error && (
                <label className="label">
                    <span className="label-text-alt text-error">{props.error}</span>
                </label>
            )}
        </div>
    );
}