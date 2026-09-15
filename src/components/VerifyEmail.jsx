// src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useParticles } from '../hooks/useParticles';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
import styles from './VerifyEmail.module.css';

function VerifyEmail() {
    const canvasRef = useParticles();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.response?.data?.message || 'Verification failed.');
            }
        };

        verify();
    }, [token]);

    if (status === 'success') {
        return (
            <div className="page-section box-grid">
                <canvas ref={canvasRef} className="page-canvas" />
                <div className={`${styles.container} fade-up`}>
                    <div className={styles.iconWrap} aria-hidden="true">
                        <div className={styles.iconRing} />
                        <ShieldCheck size={36} className={styles.iconSuccess} />
                    </div>
                    <span className={styles.badgeSuccess}>Email Verified</span>
                    <div className={styles.divider}>
                        <span className={styles.dividerDot} />
                        <span className={styles.dividerLine} />
                        <span className={styles.dividerDot} />
                    </div>
                    <h1 className={styles.title}>Your email is verified!</h1>
                    <p className={styles.description}>
                        Great news — your email address has been successfully confirmed. <br />
                        You can now log in and start using Ziplify.
                    </p>
                    <div className={styles.actions}>
                        <Link to="/auth/login" className={styles.btnPrimary} id="go-to-login">
                            Go to Login
                        </Link>
                        <Link to="/" className={styles.btnGhost} id="go-to-home">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'verifying') {
        return (
            <div className="page-section box-grid">
                <canvas ref={canvasRef} className="page-canvas" />
                <div className={`${styles.container} fade-up`}>
                    <div className={styles.iconWrap} aria-hidden="true">
                        <div className={styles.iconRing} />
                        <Loader size={36} className={styles.icon} />
                    </div>
                    <h1 className={styles.title}>Verifying your email...</h1>
                    <p className={styles.description}>Just a moment.</p>
                </div>
            </div>
        );
    }

    // status === 'error'
    return (
        <div className="page-section box-grid">
            <canvas ref={canvasRef} className="page-canvas" />
            <div className={`${styles.container} fade-up`}>
                <div className={styles.iconWrap} aria-hidden="true">
                    <div className={styles.iconRing} />
                    <ShieldAlert size={36} className={styles.icon} />
                </div>
                <span className={styles.badge}>Verification Failed</span>
                <div className={styles.divider}>
                    <span className={styles.dividerDot} />
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerDot} />
                </div>
                <h1 className={styles.title}>Something went wrong</h1>
                <p className={styles.description}>{errorMessage}</p>
                <div className={styles.actions}>
                    <Link to="/auth/login" className={styles.btnPrimary}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;