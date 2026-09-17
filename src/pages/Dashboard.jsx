import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import LinkCreator from '../components/dashboard/LinkCreator';
import StatsGrid from '../components/dashboard/StatsGrid';
import LinksTable from '../components/dashboard/LinksTable';
import ClicksChart from '../components/dashboard/ClicksChart';
import styles from './Dashboard.module.css';
import api from '../api/api';

function Dashboard() {
    const { user } = useAuth();
    const [links, setLinks] = useState();

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getLinks = async () => {
        try {
            const res = await api.get('/dashboard/urls');
            setLinks(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        getLinks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/dashboard/urls/${id}`);
            setLinks(prev => (
                { ...prev, data: prev.data.filter(l => l.id !== id) }
            ));
            // getLinks();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
                    <p className={styles.greetingSub}>Here's what's happening with your links today.</p>
                </div>

                <LinkCreator onSuccess={getLinks} />
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