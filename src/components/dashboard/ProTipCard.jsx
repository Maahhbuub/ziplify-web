import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import styles from './ProTipCard.module.css';

function ProTipCard({ loading = false }) {
    if (loading) {
        return (
            <div className={`${styles.card} ${styles.tipCard}`}>
                <div className={styles.cardHeader}>
                    <div className={`skeleton ${styles.skeletonIcon}`} />
                    <div className={`skeleton ${styles.skeletonTitle}`} />
                </div>
                <div className={`skeleton ${styles.skeletonTipText}`} />
                <div className={`skeleton ${styles.skeletonTipAction}`} />
            </div>
        );
    }

    return (
        <div className={`${styles.card} ${styles.tipCard}`}>
            <div className={styles.cardHeader}>
                <div className={`${styles.iconWrap} ${styles.tipIcon}`}>
                    <Sparkles size={16} />
                </div>
                <h3 className={styles.cardTitle}>Pro Tip</h3>
            </div>

            <div className={styles.tipBody}>
                <p className={styles.tipText}>
                    Custom aliases make your short links <strong>34% more memorable</strong> and build trust with your audience.
                </p>
                <Link to="/app/links" className={styles.tipAction}>
                    <span>Explore My Links</span>
                    <ArrowRight size={13} />
                </Link>
            </div>
        </div>
    );
}

export default ProTipCard;
