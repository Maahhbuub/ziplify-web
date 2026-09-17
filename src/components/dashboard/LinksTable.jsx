import { useState } from 'react';
import { Link2, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import styles from './LinksTable.module.css';

function LinksTable({ links, onDelete }) {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (short, id) => {
        try {
            await navigator.clipboard.writeText('https://' + short);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch { /* ignore */ }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>My Links</h2>
                <span className={styles.badge}>{links.length} links</span>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Short Link</th>
                            <th>Original URL</th>
                            <th>Clicks</th>
                            <th>Created</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map(link => (
                            <tr key={link.id}>
                                <td>
                                    <a href={'https://' + link.short} target="_blank" rel="noopener noreferrer" className={styles.shortLink}>
                                        {link.short} <ExternalLink size={11} />
                                    </a>
                                </td>
                                <td>
                                    <span className={styles.originalUrl} title={link.original}>
                                        {link.original.length > 45 ? link.original.slice(0, 45) + '…' : link.original}
                                    </span>
                                </td>
                                <td><span className={styles.clicks}>{link.clicks.toLocaleString()}</span></td>
                                <td><span className={styles.date}>{link.date}</span></td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={`${styles.actionBtn} ${copiedId === link.id ? styles.copied : ''}`}
                                            onClick={() => handleCopy(link.short, link.id)}
                                            title="Copy"
                                        >
                                            {copiedId === link.id ? <Check size={14} /> : <Copy size={14} />}
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
                        ))}
                    </tbody>
                </table>

                {links.length === 0 && (
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
