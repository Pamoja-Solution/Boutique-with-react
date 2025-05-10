import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInputEmal(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
    <>
        <label className="input">
        <span className="label">@</span>

        <input
            {...props}
            type={type}
            className={
                'input ' +
                className
            }
            placeholder="UserName"
            ref={localRef}
        />
        </label>
    </>
    );
});

