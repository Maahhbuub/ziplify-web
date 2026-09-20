import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import LinkCreator from '../components/dashboard/LinkCreator';
import StatsGrid from '../components/dashboard/StatsGrid';
import LinksTable from '../components/dashboard/LinksTable';
import ClicksChart from '../components/dashboard/ClicksChart';
import QuickInsights from '../components/dashboard/QuickInsights';
import ConfirmModal from '../components/ui/ConfirmModal';
import EditLinkModal from '../components/ui/EditLinkModal';
import styles from './Dashboard.module.css';
import api from '../api/api';
import toast from 'react-hot-toast';

function Dashboard() {
    const { user } = useAuth();
    const [links, setLinks] = useState(null);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editLink, setEditLink] = useState(null);
    const [editUrl, setEditUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getLinks = async () => {
        setLoadingLinks(true);
        try {
            const res = await api.get('/dashboard/urls');
            setLinks(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
            const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : null) || "Failed to load your links";
            toast.error(msg);
        } finally {
            setLoadingLinks(false);
        }
    };

    useEffect(() => {
        getLinks();
    }, []);

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
            setLinks(prev => ({
                ...prev,
                data: (prev?.data || []).map(l => l.id === editLink.id ? { ...l, longUrl: res.data?.data?.longUrl || editUrl.trim() } : l)
            }));
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
            setLinks(prev => ({
                ...prev,
                data: (prev?.data || []).filter(l => l.id !== deleteId)
            }));
            toast.success("Link deleted successfully");
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete link");
        } finally {
            setIsDeleting(false);
        }
    };

    const targetLink = links?.data?.find(l => l.id === deleteId);
    
    const handleAddLink = (newUrl) => {
        if (newUrl) {
            setLinks(prev => {
                const prevData = prev?.data || [];
                const exists = prevData.find(l => l.id === newUrl.id);
                if (exists) {
                    return {
                        ...prev,
                        data: prevData.map(l => l.id === newUrl.id ? newUrl : l)
                    };
                }
                return {
                    ...prev,
                    data: [newUrl, ...prevData]
                };
            });
        } else {
            getLinks();
        }
    };

    const isInitialLoading = loadingLinks && !links;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
                    <p className={styles.greetingSub}>Here's what's happening with your links today.</p>
                </div>

                <LinkCreator onAdd={handleAddLink} />
                <StatsGrid urls={links?.data || []} loading={isInitialLoading} />

                <div className={styles.mainGrid}>
                    <LinksTable links={links?.data || []} onDelete={handleDeleteClick} onEdit={handleEditClick} loading={isInitialLoading} />
                    <ClicksChart links={links?.data || []} loading={isInitialLoading} />
                </div>

                <QuickInsights links={links?.data || []} loading={isInitialLoading} />

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

export default Dashboard;