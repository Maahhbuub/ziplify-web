import { TrendingUp } from 'lucide-react';
import styles from './ClicksChart.module.css';

const MOCK_CHART = [12, 28, 18, 42, 35, 60, 55, 80, 72, 95, 88, 110, 102, 130];

function SparkLine({ data }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const norm = (v) => 1 - (v - min) / (max - min || 1);
    const W = 500, H = 80, pad = 8;
    const stepX = (W - pad * 2) / (data.length - 1);
    const points = data.map((v, i) => `${pad + i * stepX},${pad + norm(v) * (H - pad * 2)}`).join(' ');
    const area = `${pad},${H} ` + points + ` ${pad + (data.length - 1) * stepX},${H}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} preserveAspectRatio="none">
            <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#e76f51" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#e76f51" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#cg)" />
            <polyline points={points} fill="none" stroke="#e76f51" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ClicksChart({ links = [] }) {
    const topLinks = links.slice(0, 3);
    const maxClicks = topLinks[0]?.clicks || 1;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>Clicks Over Time</h2>
                <span className={styles.badge}>Last 14 days</span>
            </div>

            <SparkLine data={MOCK_CHART} />

            <div className={styles.chartFooter}>
                <span>Sep 4</span>
                <span>Sep 17</span>
            </div>

            <div className={styles.trendStat}>
                <TrendingUp size={14} style={{ color: '#10b981' }} />
                <span><strong>+34%</strong> more clicks vs last period</span>
            </div>

            {topLinks.length > 0 && (
                <div className={styles.topLinks}>
                    <p className={styles.topLabel}>Top performing</p>
                    {topLinks.map(l => (
                        <div key={l.id} className={styles.topRow}>
                            <span className={styles.topUrl}>{l.short}</span>
                            <div className={styles.bar}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${Math.round((l.clicks / maxClicks) * 100)}%` }}
                                />
                            </div>
                            <span className={styles.topClicks}>{l.clicks}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClicksChart;
