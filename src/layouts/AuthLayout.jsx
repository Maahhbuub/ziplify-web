import { Outlet } from 'react-router-dom';
import { useParticles } from '../hooks/useParticles';

function AuthLayout() {
    const canvasRef = useParticles();
    return (
        <div className="auth-shell" style={{ position: 'relative', overflow: 'hidden' }}>
            <canvas ref={canvasRef} className="page-canvas" />
            <main style={{ position: 'relative', zIndex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;