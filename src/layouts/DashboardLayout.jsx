import { Outlet } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import Footer from '../components/dashboard/Footer';
import { useParticles } from '../hooks/useParticles';
import styles from './DashboardLayout.module.css';

function DashboardLayout() {
    const canvasRef = useParticles();

    return (
        <div className={styles.shell}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <Navbar />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default DashboardLayout;