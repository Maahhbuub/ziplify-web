import { Link } from 'react-router-dom';
import { Heart, Link2 } from 'lucide-react';
import styles from './Footer.module.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link to="/dashboard" className={styles.brand}>
                        <div className={styles.logoIcon}>
                            <Link2 size={13} />
                        </div>
                        <span className={styles.brandName}>Ziplify</span>
                    </Link>
                    <span className={styles.dot}>•</span>
                    <span className={styles.copyright}>© {currentYear}</span>
                </div>

                <div className={styles.right}>
                    <span className={styles.madeWithLove}>
                        Made with <Heart size={12} className={styles.heartIcon} fill="currentColor" /> by{' '}
                        <span className={styles.author}>Mahbub</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
