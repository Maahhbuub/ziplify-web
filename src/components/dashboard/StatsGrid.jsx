import { useMemo } from 'react';
import { Link2, MousePointerClick, CalendarDays, TrendingUp } from 'lucide-react';
import styles from './StatsGrid.module.css';

function StatsGrid({ urls = [] }) {
    const stats = useMemo(() => {
        const totalLinks = urls.length;
        const totalClicks = urls.reduce((sum, url) => sum + (url.clickCount || 0), 0);
        const avgClicksPerLink = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0.0';

        const today = new Date();
        const createdToday = urls.filter((url) => {
            if (!url.createdAt) return false;
            const created = new Date(url.createdAt);
            return (
                created.getDate() === today.getDate() &&
                created.getMonth() === today.getMonth() &&
                created.getFullYear() === today.getFullYear()
            );
        }).length;

        return [
            { label: 'Total Links', value: totalLinks, icon: Link2, color: '#e76f51', bg: '#fff3f0' },
            { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Created Today', value: createdToday, icon: CalendarDays, color: '#10b981', bg: '#ecfdf5' },
            { label: 'Avg. Clicks/Link', value: avgClicksPerLink, icon: TrendingUp, color: '#8b5cf6', bg: '#f5f3ff' },
        ];
    }, [urls]);

    return (
        <div className={styles.grid}>
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={styles.card}>
                    <div className={styles.iconWrap} style={{ background: bg }}>
                        <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                        <p className={styles.label}>{label}</p>
                        <p className={styles.value}>{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsGrid;
