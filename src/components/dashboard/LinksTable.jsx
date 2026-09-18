import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Copy, Check, Trash2, ExternalLink, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './LinksTable.module.css';

function LinksTable({ links = [], onDelete, onEdit, loading = false }) {
    const [copiedId, setCopiedId] = useState(null);

    const visibleLinks = useMemo(() => {
        return [...links]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [links]);

    const handleCopy = async (code, id) => {
        try {
            const shortUrl = window.location.origin + '/' + code;
            await navigator.clipboard.writeText(shortUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.title}>My Links</h2>
                    {loading ? (
                        <div className={`skeleton ${styles.skeletonBadge}`} />
                    ) : (
                        <span className={styles.badge}>{links.length} links</span>
                    )}
                </div>
                <Link to="/dashboard/my-links" className={styles.viewAll}>
                    View all links &rarr;
                </Link>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Short Link</th>
                            <th>Original URL</th>
                            <th>Clicks</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3, 4, 5].map(n => (
                                <tr key={n} className={styles.skeletonRow}>
                                    <td><div className={`skeleton ${styles.skeletonShort}`} /></td>
                                    <td><div className={`skeleton ${styles.skeletonOriginal}`} /></td>
                                    <td><div className={`skeleton ${styles.skeletonClicks}`} /></td>
                                    <td><div className={`skeleton ${styles.skeletonDate}`} /></td>
                                    <td><div className={`skeleton ${styles.skeletonActions}`} /></td>
                                </tr>
                            ))
                        ) : (
                            visibleLinks.map(link => (
                                <tr key={link.id}>
                                    <td>
                                        <a
                                            href={window.location.origin + '/' + link.shortCode}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.shortLink}
                                        >
                                            {link.shortCode} <ExternalLink size={11} />
                                        </a>
                                    </td>
                                    <td>
                                        <span className={styles.originalUrl} title={link.longUrl}>
                                            {link.longUrl?.length > 45 ? link.longUrl.slice(0, 45) + '…' : link.longUrl}
                                        </span>
                                    </td>
                                    <td><span className={styles.clicks}>{(link.clickCount || 0).toLocaleString()}</span></td>
                                    <td><span className={styles.date}>{formatDate(link.createdAt)}</span></td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={`${styles.actionBtn} ${copiedId === link.id ? styles.copied : ''}`}
                                                onClick={() => handleCopy(link.shortCode, link.id)}
                                                title="Copy"
                                            >
                                                {copiedId === link.id ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => onEdit(link)}
                                                title="Edit URL"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => onDelete(link.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {!loading && links.length === 0 && (
                    <div className={styles.empty}>
                        <Link2 size={32} />
                        <p>No links yet. Create your first short link!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LinksTable;
