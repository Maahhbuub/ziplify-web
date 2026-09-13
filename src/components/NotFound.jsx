import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import { useParticles } from "../hooks/useParticles";

function NotFound() {
    const canvasRef = useParticles();

    return (
        <div className={`page-section box-grid`}>
            <canvas ref={canvasRef} className="page-canvas" />

            <div className={`${styles.container} fade-up`}>
                {/* 404 glitch number */}
                <div className={styles.errorCode} aria-label="404">
                    <span className={styles.glitch} data-text="404">404</span>
                </div>

                {/* Divider */}
                <div className={styles.divider}>
                    <span className={styles.dividerDot} />
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerDot} />
                </div>

                {/* Message */}
                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.description}>
                    Looks like this link got lost in the void. <br />
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Footer note */}
                <p className={styles.hint}>
                    Try shortening a valid URL on the <Link to="/" className={styles.hintLink}>Home</Link>.
                </p>
            </div>
        </div>
    );
}

export default NotFound;
