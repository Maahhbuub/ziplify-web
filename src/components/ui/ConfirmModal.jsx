import { useEffect } from 'react';
import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Link',
    message = "Are you sure you want to delete this link? This action cannot be undone.",
    itemDetails = null,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger'
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                {/* Close X button */}
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close dialog"
                >
                    <X size={15} />
                </button>

                {/* Top Icon Badge */}
                <div className={`${styles.iconWrap} ${styles[variant]}`}>
                    {variant === 'danger' ? (
                        <Trash2 size={20} className={styles.icon} />
                    ) : (
                        <AlertTriangle size={20} className={styles.icon} />
                    )}
                </div>

                {/* Content */}
                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.message}>{message}</p>

                    {itemDetails && (
                        <div className={styles.itemCard}>
                            {itemDetails.shortCode && (
                                <div className={styles.itemShort}>
                                    <span className={styles.itemLabel}>Short URL:</span>
                                    <span className={styles.itemShortCode}>
                                        {window.location.origin}/{itemDetails.shortCode}
                                    </span>
                                </div>
                            )}
                            {itemDetails.longUrl && (
                                <div className={styles.itemOriginal} title={itemDetails.longUrl}>
                                    <span className={styles.itemLabel}>Target:</span>
                                    <span className={styles.itemUrl}>
                                        {itemDetails.longUrl.length > 45
                                            ? itemDetails.longUrl.slice(0, 45) + '…'
                                            : itemDetails.longUrl}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`${styles.confirmBtn} ${styles[variant]}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={14} className={styles.spinner} />
                                <span>Deleting…</span>
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} />
                                <span>{confirmText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
