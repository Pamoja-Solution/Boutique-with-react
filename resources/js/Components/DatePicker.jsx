export default function DatePicker({ label, value, onChange, className = '', ...props }) {
    return (
        <div className={`form-control ${className}`}>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type="date"
                className="input input-bordered w-full"
                value={value}
                onChange={(e) => {
                    // Validation basique de la date
                    if (e.target.value) {
                        onChange(e.target.value);
                    }
                }}
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