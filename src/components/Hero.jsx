import styles from "./Hero.module.css"
import { useState } from "react";
import { Link2, Copy, Check } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import api from "../api/api";
import { useParticles } from "../hooks/useParticles";
import toast from 'react-hot-toast';

function Hero() {
    const canvasRef = useParticles();
    const [url, setUrl] = useState("");
    const [short, setShort] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(short);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Failed to copy");
        }
    }

    let handleUrl = (event) => {
        setUrl(event.target.value);
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        if (!url) {
            toast.error("Link can't be empty!", {
                position: "top-center",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/', { longUrl: url });
            let shortUrl = window.location.origin + "/" + res.data.code
            setShort(shortUrl);

            toast.success(res.data.message, {
                position: "top-center",
                iconTheme: {
                    primary: "#735cdd",
                },
            });
        } catch (err) {
            console.error(err.response?.data || err.message);
            const message = err.response?.data?.message || err.response?.data || err.message;
            toast.error(message, {
                position: "top-center",
            });
        } finally {
            setLoading(false);
            setUrl("");
        }
    }

    return (
        <section className={`${styles.hero} page-section box-grid`} id="hero">
            <canvas ref={canvasRef} className="page-canvas" />

            <div className={`${styles.content} fade-up`}>
                <h1 className={styles.heading}>
                    Shrink the Link <br />
                    <span className={styles.track}>Expand the Possibilities</span>
                </h1>

                <div className={styles.URL}>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={styles.URLInput}>
                            <Link2 />
                            <input value={url} onChange={handleUrl} type="text" id="url" placeholder="Paste your URL here..." />
                        </div>
                        <button type="submit" disabled={loading} className={loading ? "btn-loading" : ""}>Shorten Now</button>
                    </form>
                </div>

                {short && (
                    <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Your short link:</span>
                        <a href={short} target="_blank" rel="noopener noreferrer" className={styles.resultLink}>
                            {short}
                        </a>
                        <button
                            type="button"
                            className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ""}`}
                            onClick={handleCopy}
                        >
                            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                    </div>
                )}

                <p className={styles.footer}>Fast, simple, and free URL shortening.</p>
                <p className={styles.explore}>
                    <Link to='/auth/login'>Explore More</Link>
                </p>
            </div>

            <div className={`${styles.owner}`}>Made with <FontAwesomeIcon icon={faHeart} /> by Mahbub</div>
        </section>
    )
}

export default Hero;