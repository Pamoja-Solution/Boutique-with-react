export default function Input({ label, type = 'text', className = '', ...props }) {
    return (
        <div className={`form-control ${className}`}>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type={type}
                className="input input-bordered w-full"
                {...props}
            />
            {props.error && (
                <label className="label">
                    <span className="label-text-alt text-error">{props.error}</span>
                </label>
            )}
        </div>
    );
}