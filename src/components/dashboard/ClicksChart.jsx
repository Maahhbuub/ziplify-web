import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import styles from './ClicksChart.module.css';

// I don't know about this I made it with claude
function SparkLine({ data }) {
    if (!data || data.length < 2) return null;
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
                    <stop offset="0%" stopColor="#e76f51" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#e76f51" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#cg)" />
            <polyline points={points} fill="none" stroke="#e76f51" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ClicksChart({ links = [] }) {
    const { chartData, totalClicks, topLinks, maxClicks } = useMemo(() => {
        // Sort by clicks descending for top performers
        const sorted = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
        const top = sorted.slice(0, 3);
        const max = top[0]?.clickCount || 1;

        // Build sparkline from clickCount values (sorted by createdAt)
        const data = [...links]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(l => l.clickCount || 0);

        const total = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);

        return {
            chartData: data,
            totalClicks: total,
            topLinks: top,
            maxClicks: max,
        };
    }, [links]);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>Clicks Overview</h2>
                <span className={styles.badge}>{totalClicks} total clicks</span>
            </div>

            {chartData.length >= 2 ? (
                <SparkLine data={chartData} />
            ) : (
                <div className={styles.chart} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--subtext)', fontSize: '0.82rem' }}>
                    Not enough data to plot
                </div>
            )}

            <div className={styles.chartFooter}>
                <span>{links.length} link{links.length !== 1 ? 's' : ''}</span>
                <span>{totalClicks} click{totalClicks !== 1 ? 's' : ''}</span>
            </div>

            <div className={styles.trendStat}>
                <TrendingUp size={14} style={{ color: '#10b981' }} />
                <span>Avg. <strong>{links.length ? (totalClicks / links.length).toFixed(1) : 0}</strong> clicks per link</span>
            </div>

            {topLinks.length > 0 && (
                <div className={styles.topLinks}>
                    <p className={styles.topLabel}>Top performing</p>
                    {topLinks.map(l => (
                        <div key={l.id} className={styles.topRow}>
                            <span className={styles.topUrl}>{l.shortCode}</span>
                            <div className={styles.bar}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${Math.round(((l.clickCount || 0) / maxClicks) * 100)}%` }}
                                />
                            </div>
                            <span className={styles.topClicks}>{l.clickCount || 0}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClicksChart;
