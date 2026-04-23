import React from 'react';
import styles from '../styles/ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.content}>
                    <p>{message}</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>Hủy</button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
