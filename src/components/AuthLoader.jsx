import styles from "./AuthLoader.module.css";

/**
 * Full-screen authentication loader shown while the app verifies
 * the current user session (used by GuestRoute & PrivateRoute).
 */
const AuthLoader = () => {
    return (
        <div className={styles.overlay} role="status" aria-label="Verifying authentication">

            {/* ── Orbital spinner scene ── */}
            <div className={styles.scene}>
                <span className={styles.ringOuter} />
                <span className={styles.ringMiddle} />
                <span className={styles.ringInner} />

                {/* Brand logo tile in the centre */}
                <div className={styles.logo}>
                    {/* Link / zip icon */}
                    <svg className={styles.logoIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                </div>
            </div>

            {/* ── Label ── */}
            <p className={styles.label}>Verifying session</p>

            {/* ── Dot trail ── */}
            <div className={styles.dots} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
            </div>
        </div>
    );
};

export default AuthLoader;
