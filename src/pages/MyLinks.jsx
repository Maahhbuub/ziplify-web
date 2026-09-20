import { useState, useEffect, useMemo, useRef } from 'react';
import { Copy, Check, Trash2, ExternalLink, Link2, Search, ArrowUpDown, Filter, ChevronDown, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import EditLinkModal from '../components/ui/EditLinkModal';
import LinkCreator from '../components/dashboard/LinkCreator';
import ConfirmModal from '../components/ui/ConfirmModal';
import api from '../api/api';
import toast from 'react-hot-toast';
import styles from './MyLinks.module.css';

const STATUS_OPTIONS = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Most Clicks', value: 'clicks' },
];

function MyLinks() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [copiedId, setCopiedId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editLink, setEditLink] = useState(null);
    const [editUrl, setEditUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [statusDropOpen, setStatusDropOpen] = useState(false);
    const [sortDropOpen, setSortDropOpen] = useState(false);
    const statusDropRef = useRef(null);
    const sortDropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (statusDropRef.current && !statusDropRef.current.contains(e.target)) {
                setStatusDropOpen(false);
            }
            if (sortDropRef.current && !sortDropRef.current.contains(e.target)) {
                setSortDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const getLinks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/dashboard/urls');
            setLinks(res.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to load links");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLinks();
    }, []);

    const handleAdd = (newLink) => {
        if (newLink) {
            setLinks(prev => {
                const exists = prev.find(l => l.id === newLink.id);
                if (exists) {
                    return prev.map(l => l.id === newLink.id ? newLink : l);
                }
                return [newLink, ...prev];
            });
        } else {
            getLinks();
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleEditClick = (link) => {
        setEditLink(link);
        setEditUrl(link.longUrl || '');
    };

    const handleEditSave = async () => {
        if (!editUrl.trim()) return toast.error('URL cannot be empty');
        setIsSaving(true);
        try {
            const res = await api.patch(`/dashboard/urls/${editLink.id}`, { longUrl: editUrl.trim() });
            setLinks(prev => prev.map(l => l.id === editLink.id ? { ...l, longUrl: res.data?.data?.longUrl || editUrl.trim() } : l));
            toast.success('Link updated!');
            setEditLink(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update link');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await api.delete(`/dashboard/urls/${deleteId}`);
            setLinks(prev => prev.filter(l => l.id !== deleteId));
            toast.success("Link deleted successfully");
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete link");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopy = async (shortCode, id) => {
        try {
            const shortUrl = window.location.origin + '/' + shortCode;
            await navigator.clipboard.writeText(shortUrl);
            setCopiedId(id);
            toast.success("Copied to clipboard!");
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

    const isLinkExpired = (expiresAt) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    const filteredLinks = useMemo(() => {
        const query = search.trim().toLowerCase();
        const now = new Date();

        return links
            .filter(l => {
                const matchesSearch =
                    !query ||
                    (l.shortCode || '').toLowerCase().includes(query) ||
                    (l.longUrl || '').toLowerCase().includes(query);

                if (!matchesSearch) return false;

                const expired = l.expiresAt && new Date(l.expiresAt) < now;
                if (filterStatus === 'active') return !expired;
                if (filterStatus === 'expired') return expired;
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'clicks') {
                    return (b.clickCount || 0) - (a.clickCount || 0);
                }
                if (sortBy === 'oldest') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [links, search, filterStatus, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus, sortBy, links.length]);

    const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);
    const paginatedLinks = filteredLinks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const targetLink = links.find(l => l.id === deleteId);

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.title}>My Links</h1>
                        <p className={styles.subtitle}>Manage, track, and monitor all your shortened URLs.</p>
                    </div>
                    {loading ? (
                        <div className={`skeleton ${styles.skeletonTotalBadge}`} />
                    ) : (
                        <span className={styles.totalBadge}>{links.length} total link{links.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                <LinkCreator onAdd={handleAdd} />

                <div className={styles.toolbar}>
                    <div className={styles.searchWrap}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by short code or original URL…"
                            id="links-search"
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.toolbarRight}>
                        <div className={styles.dropdownWrap} ref={statusDropRef}>
                            <button
                                type="button"
                                className={styles.dropdownTrigger}
                                onClick={() => {
                                    setStatusDropOpen(v => !v);
                                    setSortDropOpen(false);
                                }}
                                aria-expanded={statusDropOpen}
                                aria-label="Filter links by status"
                            >
                                <Filter size={13} className={styles.dropdownIcon} />
                                <span className={filterStatus !== 'all' ? styles.dropdownActive : styles.dropdownText}>
                                    {STATUS_OPTIONS.find(o => o.value === filterStatus)?.label}
                                </span>
                                <ChevronDown size={13} className={`${styles.chevron} ${statusDropOpen ? styles.chevronOpen : ''}`} />
                            </button>

                            {statusDropOpen && (
                                <div className={styles.menu}>
                                    {STATUS_OPTIONS.map(o => (
                                        <button
                                            key={o.value}
                                            type="button"
                                            className={`${styles.option} ${filterStatus === o.value ? styles.optionActive : ''}`}
                                            onClick={() => {
                                                setFilterStatus(o.value);
                                                setStatusDropOpen(false);
                                            }}
                                        >
                                            <span>{o.label}</span>
                                            {filterStatus === o.value && <Check size={13} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.dropdownWrap} ref={sortDropRef}>
                            <button
                                type="button"
                                className={styles.dropdownTrigger}
                                onClick={() => {
                                    setSortDropOpen(v => !v);
                                    setStatusDropOpen(false);
                                }}
                                aria-expanded={sortDropOpen}
                                aria-label="Sort links"
                            >
                                <ArrowUpDown size={13} className={styles.dropdownIcon} />
                                <span className={sortBy !== 'newest' ? styles.dropdownActive : styles.dropdownText}>
                                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                                </span>
                                <ChevronDown size={13} className={`${styles.chevron} ${sortDropOpen ? styles.chevronOpen : ''}`} />
                            </button>

                            {sortDropOpen && (
                                <div className={styles.menu}>
                                    {SORT_OPTIONS.map(o => (
                                        <button
                                            key={o.value}
                                            type="button"
                                            className={`${styles.option} ${sortBy === o.value ? styles.optionActive : ''}`}
                                            onClick={() => {
                                                setSortBy(o.value);
                                                setSortDropOpen(false);
                                            }}
                                        >
                                            <span>{o.label}</span>
                                            {sortBy === o.value && <Check size={13} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!loading && (
                            <span className={styles.resultCount}>
                                {filteredLinks.length} result{filteredLinks.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [1, 2, 3, 4, 5, 6].map(n => (
                                        <tr key={n} className={styles.skeletonRow}>
                                            <td><div className={`skeleton ${styles.skeletonShort}`} /></td>
                                            <td><div className={`skeleton ${styles.skeletonOriginal}`} /></td>
                                            <td><div className={`skeleton ${styles.skeletonClicks}`} /></td>
                                            <td><div className={`skeleton ${styles.skeletonExpire}`} /></td>
                                            <td><div className={`skeleton ${styles.skeletonDate}`} /></td>
                                            <td><div className={`skeleton ${styles.skeletonActions}`} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    paginatedLinks.map(link => {
                                        const expired = isLinkExpired(link.expiresAt);

                                        return (
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
                                                        {link.longUrl?.length > 48
                                                            ? link.longUrl.slice(0, 48) + '…'
                                                            : link.longUrl}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.clicks}>
                                                        {(link.clickCount || 0).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td>
                                                    {expired ? (
                                                        <span className={styles.expiredBadge}>
                                                            Expired ({formatDate(link.expiresAt)})
                                                        </span>
                                                    ) : link.expiresAt ? (
                                                        <span className={styles.expire}>
                                                            {formatDate(link.expiresAt)}
                                                        </span>
                                                    ) : (
                                                        <span className={styles.noExpire}>Never</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={styles.date}>{formatDate(link.createdAt)}</span>
                                                </td>
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
                                                            onClick={() => handleEditClick(link)}
                                                            title="Edit URL"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                            onClick={() => handleDeleteClick(link.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {!loading && filteredLinks.length === 0 && (
                            <div className={styles.empty}>
                                <Link2 size={32} />
                                <p>
                                    {search || filterStatus !== 'all'
                                        ? 'No links match your filter or search criteria.'
                                        : 'No links yet. Create your first short link above!'}
                                </p>
                            </div>
                        )}
                        {!loading && totalPages > 1 && (() => {
                            const pages = [];
                            for (let i = 1; i <= totalPages; i++) {
                                if (
                                    i === 1 || i === totalPages ||
                                    (i >= currentPage - 1 && i <= currentPage + 1)
                                ) {
                                    pages.push(i);
                                } else if (
                                    (i === currentPage - 2 && currentPage - 2 > 1) ||
                                    (i === currentPage + 2 && currentPage + 2 < totalPages)
                                ) {
                                    pages.push('...');
                                }
                            }
                            const uniquePages = pages.filter((p, i) => p !== pages[i - 1]);
                            return (
                                <div className={styles.pagination}>
                                    <span className={styles.pageCount}>
                                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredLinks.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLinks.length)} of {filteredLinks.length}
                                    </span>
                                    <div className={styles.pageControls}>
                                        <button
                                            className={styles.pageNavBtn}
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {uniquePages.map((p, i) =>
                                            p === '...' ? (
                                                <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    className={`${styles.pageNumBtn} ${currentPage === p ? styles.pageNumActive : ''}`}
                                                    onClick={() => setCurrentPage(p)}
                                                    aria-label={`Page ${p}`}
                                                    aria-current={currentPage === p ? 'page' : undefined}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}
                                        <button
                                            className={styles.pageNavBtn}
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>

                <ConfirmModal
                    isOpen={Boolean(deleteId)}
                    onClose={() => !isDeleting && setDeleteId(null)}
                    onConfirm={handleConfirmDelete}
                    isLoading={isDeleting}
                    title="Delete Short Link"
                    message="Are you sure you want to delete this link? Anyone visiting this URL will no longer be redirected. This action cannot be undone."
                    itemDetails={targetLink}
                    confirmText="Yes, Delete"
                />

                <EditLinkModal
                    link={editLink}
                    url={editUrl}
                    isSaving={isSaving}
                    onChange={setEditUrl}
                    onSave={handleEditSave}
                    onClose={() => setEditLink(null)}
                />

            </div>
        </div>
    );
}

export default MyLinks;
