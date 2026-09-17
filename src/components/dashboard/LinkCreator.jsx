import { useState, useRef, useEffect } from 'react';
import { Link2, CalendarDays, ChevronDown, Check } from 'lucide-react';
import styles from './LinkCreator.module.css';

const EXPIRE_OPTIONS = [
    { label: 'No expiry',  value: '' },
    { label: '10 days',    value: '10' },
    { label: '30 days',    value: '30' },
    { label: '6 months',   value: '180' },
    { label: '1 year',     value: '365' },
];

function LinkCreator({ onAdd }) {
    const [newUrl, setNewUrl] = useState('');
    const [expireDays, setExpireDays] = useState('');
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newUrl.trim()) return;

        const expireAt = expireDays
            ? new Date(Date.now() + Number(expireDays) * 86400000)
                .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null;

        onAdd({
            id: Date.now(),
            original: newUrl.trim(),
            short: `zplfy.io/${Math.random().toString(36).slice(2, 7)}`,
            clicks: 0,
            expireAt,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });

        setNewUrl('');
        setExpireDays('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fields}>

                {/* URL input */}
                <div className={styles.urlInput}>
                    <Link2 size={16} className={styles.icon} />
                    <input
                        type="url"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        placeholder="Paste your long URL here…"
                        id="new-url-input"
                        required
                    />
                </div>

                {/* Expiry dropdown */}
                <div className={styles.expireWrap} ref={dropRef}>
                    <button
                        type="button"
                        className={styles.expireTrigger}
                        onClick={() => setDropOpen(v => !v)}
                        id="expire-select"
                    >
                        <CalendarDays size={14} className={styles.icon} />
                        <span className={expireDays ? styles.expireActive : styles.expirePlaceholder}>
                            {EXPIRE_OPTIONS.find(o => o.value === expireDays)?.label ?? 'No expiry'}
                        </span>
                        <ChevronDown size={13} className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ''}`} />
                    </button>

                    {dropOpen && (
                        <div className={styles.menu}>
                            {EXPIRE_OPTIONS.map(o => (
                                <button
                                    key={o.value}
                                    type="button"
                                    className={`${styles.option} ${expireDays === o.value ? styles.optionActive : ''}`}
                                    onClick={() => { setExpireDays(o.value); setDropOpen(false); }}
                                >
                                    {o.label}
                                    {expireDays === o.value && <Check size={13} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button type="submit" className={styles.submit}>Shorten Now</button>
        </form>
    );
}

export default LinkCreator;
