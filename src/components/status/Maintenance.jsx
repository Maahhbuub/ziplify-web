import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { useParticles } from '../../hooks/useParticles';
import { Wrench, LogOut } from 'lucide-react';
import styles from './Maintenance.module.css';

function Maintenance() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useParticles();

    const handleLogout = async () => {
        try {
            navigate('/');
            await logout();
        } catch (err) {
            console.error(err?.response?.data?.message || 'Logout failed');
        }
    };

    return (
        <div className="page-section box-grid">
            <canvas ref={canvasRef} className="page-canvas" />

            <div className={`${styles.container} fade-up`}>

                {/* Animated icon */}
                <div className={styles.iconWrap} aria-hidden="true">
                    <div className={styles.iconRing} />
                    <Wrench size={36} className={styles.icon} />
                </div>

                {/* Status badge */}
                <span className={styles.badge}>Under Maintenance</span>

                {/* Divider */}
                <div className={styles.divider}>
                    <span className={styles.dividerDot} />
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerDot} />
                </div>

                {/* Heading */}
                <h1 className={styles.title}>We'll be back soon</h1>
                <p className={styles.description}>
                    We're currently working on some improvements to give you a better experience.
                    <br />
                    Hang tight — we'll be back shortly.
                </p>

                {/* Logout */}
                {user && (
                    <div className={styles.actions}>
                        <p className={styles.greeting}>Logged in as <strong>{user.name}</strong></p>
                        <button
                            id="maintenance-logout-btn"
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Maintenance;
