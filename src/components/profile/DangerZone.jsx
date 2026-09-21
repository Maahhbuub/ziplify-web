import { useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './DangerZone.module.css';

function DangerZone({ onDeleteAccount }) {
    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!password.trim()) return toast.error('Please enter your password');
        setDeleting(true);
        try {
            await onDeleteAccount(password);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setConfirming(false);
        setPassword('');
        setShowPassword(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.icon}><Trash2 size={16} /></span>
                <h2 className={styles.title}>Danger Zone</h2>
            </div>

            {!confirming ? (
                <div className={styles.row}>
                    <div>
                        <p className={styles.label}>Delete account</p>
                        <p className={styles.desc}>
                            Permanently delete your account and all of your links. This cannot be undone.
                        </p>
                    </div>
                    <button className={styles.btnDanger} onClick={() => setConfirming(true)}>
                        Delete Account
                    </button>
                </div>
            ) : (
                <div className={styles.confirm}>
                    <p className={styles.desc}>
                        Enter your password to confirm account deletion:
                    </p>
                    <div className={styles.pwWrap}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={styles.input}
                            placeholder="Your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleDelete()}
                            autoFocus
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(p => !p)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <div className={styles.actions}>
                        <button
                            className={styles.btnDanger}
                            onClick={handleDelete}
                            disabled={deleting || !password.trim()}
                        >
                            {deleting ? 'Deleting…' : 'Confirm Delete'}
                        </button>
                        <button className={styles.btnCancel} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DangerZone;
