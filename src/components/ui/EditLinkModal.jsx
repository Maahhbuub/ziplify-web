import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './EditLinkModal.module.css';

function EditLinkModal({ link, url, isSaving, onChange, onSave, onClose }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!link) return;

        // Auto-focus input
        setTimeout(() => inputRef.current?.focus(), 50);

        // Handle Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isSaving) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [link, isSaving, onClose]);

    if (!link) return null;

    return (
        <div className={styles.overlay} onClick={() => !isSaving && onClose()}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                <div className={styles.header}>
                    <div>
                        <p className={styles.title}>Edit Destination URL</p>
                        <p className={styles.subtitle}>The short code stays the same</p>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => !isSaving && onClose()}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Short Code</label>
                    <div className={styles.readonly}>
                        {window.location.origin}/{link.shortCode}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="edit-long-url">Destination URL</label>
                    <input
                        id="edit-long-url"
                        ref={inputRef}
                        type="url"
                        className={styles.input}
                        value={url}
                        onChange={e => onChange(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSave()}
                        placeholder="https://example.com/your-long-url"
                        disabled={isSaving}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${styles.saveBtn} ${isSaving ? 'btn-loading' : ''}`}
                        onClick={onSave}
                        disabled={isSaving || !url.trim()}
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditLinkModal;
