import { useState, useRef, useEffect } from 'react';
import { Link2, CalendarDays, ChevronDown, Check, PenLine, Copy } from 'lucide-react';
import styles from './LinkCreator.module.css';
import toast from 'react-hot-toast';
import api from '../../api/api';

const EXPIRE_OPTIONS = [
    { label: 'No expiry', value: '' },
    { label: '7 days', value: '7' },
    { label: '30 days', value: '30' },
    { label: '6 months', value: '180' },
    { label: '1 year', value: '365' },
];

function LinkCreator({ onAdd }) {
    const [formdata, setFormdata] = useState({
        url: "",
        alias: "",
        expireDay: "",
    });

    const [loading, setLoading] = useState(false);
    const [short, setShort] = useState("");
    const [copied, setCopied] = useState(false);

    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleData = (event) => {
        const { name, value } = event.target;
        setFormdata((curr) => ({
            ...curr,
            [name]: value,
        }));
    };

    const handleCopy = async () => {
        if (!short) return;
        try {
            await navigator.clipboard.writeText(short);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formdata.url.trim()) {
            toast.error("URL can not be empty");
            return;
        };

        setLoading(true);

        try {
            const payload = {
                longUrl: formdata.url.trim(),
            };
            if (formdata.alias.trim()) payload.alias = formdata.alias.trim();
            if (formdata.expireDay) payload.expiresInDays = Number(formdata.expireDay);

            const res = await api.post('/', payload);
            setShort(window.location.origin + "/" + res.data.url.shortCode);

            toast.success(res.data.message);
            setFormdata({ url: '', alias: '', expireDay: '' });
            if (onAdd) onAdd(res.data.url);

        } catch (err) {
            console.error(err.response?.data || err.message);
            const message = err.response?.data?.message || err.response?.data || err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fields}>

                    <div className={styles.urlInput}>
                        <Link2 size={16} className={styles.icon} />
                        <input
                            type="text"
                            name="url"
                            value={formdata.url}
                            onChange={handleData}
                            placeholder="Paste your long URL here…"
                            id="new-url-input"
                        />
                    </div>

                    <div className={styles.aliasWrap}>
                        <PenLine size={15} className={styles.icon} />
                        <input
                            type="text"
                            name="alias"
                            value={formdata.alias}
                            onChange={handleData}
                            placeholder="alias (optional)"
                            className={styles.aliasInput}
                            maxLength={10}
                        />
                    </div>

                    <div className={styles.expireWrap} ref={dropRef}>
                        <button
                            type="button"
                            className={styles.expireTrigger}
                            onClick={() => setDropOpen(v => !v)}
                            id="expire-select"
                        >
                            <CalendarDays size={14} className={styles.icon} />
                            <span className={formdata.expireDay ? styles.expireActive : styles.expirePlaceholder}>
                                {EXPIRE_OPTIONS.find(o => o.value === formdata.expireDay)?.label ?? 'No expiry'}
                            </span>
                            <ChevronDown size={13} className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ''}`} />
                        </button>

                        {dropOpen && (
                            <div className={styles.menu}>
                                {EXPIRE_OPTIONS.map(o => (
                                    <button
                                        key={o.value}
                                        type="button"
                                        className={`${styles.option} ${formdata.expireDay === o.value ? styles.optionActive : ''}`}
                                        onClick={() => {
                                            setFormdata(curr => ({ ...curr, expireDay: o.value }));
                                            setDropOpen(false);
                                        }}
                                    >
                                        {o.label}
                                        {formdata.expireDay === o.value && <Check size={13} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`${styles.submit} ${loading ? 'btn-loading' : ''}`}>
                    Shorten Now
                </button>
            </form>

            {short && (
                <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Short link:</span>
                    <a
                        href={short}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resultLink}
                    >
                        {short}
                    </a>
                    <button
                        type="button"
                        className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ''}`}
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check size={14} />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <> <Copy size={14} /> Copy </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default LinkCreator;
