import { useState } from 'react';
import { Copy, Check, Trash2, ExternalLink, Link2, Search, Filter } from 'lucide-react';
import LinkCreator from '../components/dashboard/LinkCreator';
import styles from './MyLinks.module.css';

const MOCK_LINKS = [
    { id: 1, original: 'https://www.google.com/search?q=react+dashboard+ui', short: 'zplfy.io/goog1', clicks: 342, date: 'Sep 17, 2026', expireAt: null },
    { id: 2, original: 'https://github.com/mahbub/ziplify-web/blob/main/README.md', short: 'zplfy.io/ghb2', clicks: 210, date: 'Sep 16, 2026', expireAt: 'Oct 16, 2026' },
    { id: 3, original: 'https://tailwindcss.com/docs/installation', short: 'zplfy.io/twnd3', clicks: 189, date: 'Sep 15, 2026', expireAt: null },
    { id: 4, original: 'https://react.dev/learn/adding-interactivity', short: 'zplfy.io/rct4', clicks: 97, date: 'Sep 14, 2026', expireAt: 'Oct 14, 2026' },
    { id: 5, original: 'https://vite.dev/guide/', short: 'zplfy.io/vite5', clicks: 54, date: 'Sep 12, 2026', expireAt: null },
    { id: 6, original: 'https://developer.mozilla.org/en-US/docs/Web/CSS', short: 'zplfy.io/mdn6', clicks: 38, date: 'Sep 10, 2026', expireAt: null },
    { id: 7, original: 'https://nodejs.org/en/docs', short: 'zplfy.io/node7', clicks: 22, date: 'Sep 8, 2026', expireAt: 'Dec 8, 2026' },
];

function MyLinks() {
    const [links, setLinks] = useState(MOCK_LINKS);
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const handleAdd = (link) => setLinks(prev => [link, ...prev]);
    const handleDelete = (id) => setLinks(prev => prev.filter(l => l.id !== id));

    const handleCopy = async (short, id) => {
        try {
            await navigator.clipboard.writeText('https://' + short);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch { /* ignore */ }
    };

    const filtered = links.filter(l =>
        l.short.toLowerCase().includes(search.toLowerCase()) ||
        l.original.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.title}>My Links</h1>
                        <p className={styles.subtitle}>Manage and track all your shortened URLs.</p>
                    </div>
                    <span className={styles.totalBadge}>{links.length} total links</span>
                </div>

                {/* Creator */}
                <LinkCreator onSuccess={handleAdd} />

                {/* Search + filter bar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchWrap}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search links…"
                            id="links-search"
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.toolbarRight}>
                        <span className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Links list */}
                <div className={styles.card}>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Short Link</th>
                                    <th>Original URL</th>
                                    <th>Clicks</th>
                                    <th>Expires</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(link => (
                                    <tr key={link.id}>
                                        <td>
                                            <a
                                                href={'https://' + link.short}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.shortLink}
                                            >
                                                {link.short} <ExternalLink size={11} />
                                            </a>
                                        </td>
                                        <td>
                                            <span className={styles.originalUrl} title={link.original}>
                                                {link.original.length > 48 ? link.original.slice(0, 48) + '…' : link.original}
                                            </span>
                                        </td>
                                        <td><span className={styles.clicks}>{link.clicks.toLocaleString()}</span></td>
                                        <td>
                                            {link.expireAt
                                                ? <span className={styles.expire}>{link.expireAt}</span>
                                                : <span className={styles.noExpire}>Never</span>}
                                        </td>
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
                                                    onClick={() => handleDelete(link.id)}
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

                        {filtered.length === 0 && (
                            <div className={styles.empty}>
                                <Link2 size={32} />
                                <p>{search ? 'No links match your search.' : 'No links yet. Create your first short link!'}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MyLinks;
