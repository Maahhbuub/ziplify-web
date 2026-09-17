import { useMemo } from 'react';
import { Activity } from 'lucide-react';
import styles from './LinkHealthCard.module.css';

function LinkHealthCard({ links = [], loading = false }) {
    const healthData = useMemo(() => {
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        let active = 0;
        let expiringSoon = 0;
        let expired = 0;

        links.forEach(l => {
            if (!l.expiresAt) {
                active += 1;
            } else {
                const exp = new Date(l.expiresAt);
                if (exp <= now) {
                    expired += 1;
                } else if (exp <= sevenDaysFromNow) {
                    expiringSoon += 1;
                } else {
                    active += 1;
                }
            }
        });

        const total = links.length || 1;
        return {
            active,
            expiringSoon,
            expired,
            activePercent: Math.round((active / total) * 100),
            expiringPercent: Math.round((expiringSoon / total) * 100),
            expiredPercent: Math.round((expired / total) * 100),
        };
    }, [links]);

    if (loading) {
        return (
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={`skeleton ${styles.skeletonIcon}`} />
                    <div className={`skeleton ${styles.skeletonTitle}`} />
                </div>
                <div className={styles.healthStats}>
                    <div className={`skeleton ${styles.skeletonStatBlock}`} />
                    <div className={`skeleton ${styles.skeletonStatBlock}`} />
                    <div className={`skeleton ${styles.skeletonStatBlock}`} />
                </div>
                <div className={`skeleton ${styles.skeletonProgressBar}`} />
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={`${styles.iconWrap} ${styles.healthIcon}`}>
                    <Activity size={16} />
                </div>
                <h3 className={styles.cardTitle}>Link Health</h3>
            </div>

            <div className={styles.healthStats}>
                <div className={styles.healthItem}>
                    <span className={styles.healthDotActive} />
                    <div className={styles.healthDetails}>
                        <span className={styles.healthCount}>{healthData.active}</span>
                        <span className={styles.healthLabel}>Active</span>
                    </div>
                </div>
                <div className={styles.healthItem}>
                    <span className={styles.healthDotWarning} />
                    <div className={styles.healthDetails}>
                        <span className={styles.healthCount}>{healthData.expiringSoon}</span>
                        <span className={styles.healthLabel}>Expiring</span>
                    </div>
                </div>
                <div className={styles.healthItem}>
                    <span className={styles.healthDotExpired} />
                    <div className={styles.healthDetails}>
                        <span className={styles.healthCount}>{healthData.expired}</span>
                        <span className={styles.healthLabel}>Expired</span>
                    </div>
                </div>
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progressActive}
                    style={{ width: `${healthData.activePercent}%` }}
                    title={`Active: ${healthData.active}`}
                />
                <div
                    className={styles.progressWarning}
                    style={{ width: `${healthData.expiringPercent}%` }}
                    title={`Expiring soon: ${healthData.expiringSoon}`}
                />
                <div
                    className={styles.progressExpired}
                    style={{ width: `${healthData.expiredPercent}%` }}
                    title={`Expired: ${healthData.expired}`}
                />
            </div>
        </div>
    );
}

export default LinkHealthCard;
