import React, { useState } from 'react';
import styles from '../styles/PasswordInput.module.css';

/**
 * @param {object} props
 * @param {string}   props.id          - ID của input (để liên kết label)
 * @param {string}   props.placeholder
 * @param {string}   props.value
 * @param {function} props.onChange
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.className] - class bổ sung cho wrapper
 */
function PasswordInput({ id, placeholder, value, onChange, required = false, disabled = false, className = '' }) {
    const [show, setShow] = useState(false);

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <input
                id={id}
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={styles.input}
                // Tắt native browser password icon (Edge/Chrome/Safari)
                autoComplete="current-password"
            />
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShow(prev => !prev)}
                disabled={disabled}
                tabIndex={-1}
                aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
                {show ? (
                    // Eye-off icon (đang hiện → bấm để ẩn)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    // Eye icon (đang ẩn → bấm để hiện)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default PasswordInput;
