import { useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import LinkCreator from '../components/dashboard/LinkCreator';
import StatsGrid from '../components/dashboard/StatsGrid';
import LinksTable from '../components/dashboard/LinksTable';
import ClicksChart from '../components/dashboard/ClicksChart';
import styles from './Dashboard.module.css';

const MOCK_LINKS = [
    { id: 1, original: 'https://www.google.com/search?q=react+dashboard+ui', short: 'zplfy.io/goog1', clicks: 342, date: 'Sep 17, 2026' },
    { id: 2, original: 'https://github.com/mahbub/ziplify-web/blob/main/README.md', short: 'zplfy.io/ghb2', clicks: 210, date: 'Sep 16, 2026' },
    { id: 3, original: 'https://tailwindcss.com/docs/installation', short: 'zplfy.io/twnd3', clicks: 189, date: 'Sep 15, 2026' },
    { id: 4, original: 'https://react.dev/learn/adding-interactivity', short: 'zplfy.io/rct4', clicks: 97, date: 'Sep 14, 2026' },
    { id: 5, original: 'https://vite.dev/guide/', short: 'zplfy.io/vite5', clicks: 54, date: 'Sep 12, 2026' },
];

function Dashboard() {
    const { user } = useAuth();
    const [links, setLinks] = useState(MOCK_LINKS);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const handleAdd    = (link) => setLinks(prev => [link, ...prev]);
    const handleDelete = (id)   => setLinks(prev => prev.filter(l => l.id !== id));

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
                    <p className={styles.greetingSub}>Here's what's happening with your links today.</p>
                </div>

                {/* Link creator */}
                <LinkCreator onAdd={handleAdd} />

                {/* Stats */}
                <StatsGrid />

                {/* Table + Chart */}
                <div className={styles.mainGrid}>
                    <LinksTable links={links} onDelete={handleDelete} />
                    <ClicksChart links={links} />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;