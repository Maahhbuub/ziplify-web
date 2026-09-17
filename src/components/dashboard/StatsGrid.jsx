import { Link2, MousePointerClick, CalendarDays, TrendingUp } from 'lucide-react';
import styles from './StatsGrid.module.css';

const STATS = [
    { label: 'Total Links',   value: '24',    icon: Link2,            color: '#e76f51', bg: '#fff3f0' },
    { label: 'Total Clicks',  value: '1,842', icon: MousePointerClick, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Created Today', value: '3',     icon: CalendarDays,     color: '#10b981', bg: '#ecfdf5' },
    { label: 'Avg. CTR',      value: '76.8%', icon: TrendingUp,       color: '#8b5cf6', bg: '#f5f3ff' },
];

function StatsGrid() {
    return (
        <div className={styles.grid}>
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
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
