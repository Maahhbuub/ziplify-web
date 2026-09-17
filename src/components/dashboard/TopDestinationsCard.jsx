import { useMemo } from 'react';
import { Globe } from 'lucide-react';
import styles from './TopDestinationsCard.module.css';

function TopDestinationsCard({ links = [], loading = false }) {
    const topDomains = useMemo(() => {
        const domainCounts = {};

        links.forEach(l => {
            if (!l.longUrl) return;
            try {
                let host = new URL(l.longUrl).hostname.replace(/^www\./, '');
                domainCounts[host] = (domainCounts[host] || 0) + 1;
            } catch {
                domainCounts['other'] = (domainCounts['other'] || 0) + 1;
            }
        });

        const sorted = Object.entries(domainCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([domain, count]) => ({
                domain,
                count,
                percentage: Math.round((count / (links.length || 1)) * 100),
            }));

        return sorted;
    }, [links]);

    if (loading) {
        return (
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={`skeleton ${styles.skeletonIcon}`} />
                    <div className={`skeleton ${styles.skeletonTitle}`} />
                </div>
                <div className={styles.domainsList}>
                    <div className={`skeleton ${styles.skeletonDomainRow}`} />
                    <div className={`skeleton ${styles.skeletonDomainRow}`} />
                    <div className={`skeleton ${styles.skeletonDomainRow}`} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={`${styles.iconWrap} ${styles.domainIcon}`}>
                    <Globe size={16} />
                </div>
                <h3 className={styles.cardTitle}>Top Destinations</h3>
            </div>

            {topDomains.length > 0 ? (
                <div className={styles.domainsList}>
                    {topDomains.map(item => (
                        <div key={item.domain} className={styles.domainRow}>
                            <div className={styles.domainInfo}>
                                <span className={styles.domainName}>{item.domain}</span>
                                <span className={styles.domainCount}>
                                    {item.count} {item.count === 1 ? 'link' : 'links'}
                                </span>
                            </div>
                            <div className={styles.domainBarTrack}>
                                <div
                                    className={styles.domainBarFill}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyWrap}>
                    <p className={styles.emptyText}>Create links to see top target domains</p>
                </div>
            )}
        </div>
    );
}

export default TopDestinationsCard;
