import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import LinkCreator from '../components/dashboard/LinkCreator';
import StatsGrid from '../components/dashboard/StatsGrid';
import LinksTable from '../components/dashboard/LinksTable';
import ClicksChart from '../components/dashboard/ClicksChart';
import AuthLoader from '../components/ui/AuthLoader';
import styles from './Dashboard.module.css';
import api from '../api/api';
import toast from 'react-hot-toast';

function Dashboard() {
    const { user } = useAuth();
    const [links, setLinks] = useState(null);
    const [loadingLinks, setLoadingLinks] = useState(true);

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

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete this link? This can't be undone.")) return;
            await api.delete(`/dashboard/urls/${id}`);
            setLinks(prev => (
                { ...prev, data: prev.data.filter(l => l.id !== id) }
            ));
            // getLinks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete link");
        }
    };

    const handleAddLink = (newUrl) => {
        if (newUrl) {
            setLinks(prev => ({
                ...prev,
                data: [newUrl, ...(prev?.data || [])]
            }));
        } else {
            getLinks();
        }
    };

    if (loadingLinks && !links) {
        return (
            <div className={styles.page}>
                <AuthLoader fullScreen={false} label="Loading your links..." />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
                    <p className={styles.greetingSub}>Here's what's happening with your links today.</p>
                </div>

                <LinkCreator onAdd={handleAddLink} />
                <StatsGrid urls={links?.data || []} />

                <div className={styles.mainGrid}>
                    <LinksTable links={links?.data || []} onDelete={handleDelete} />
                    <ClicksChart links={links?.data || []} />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;