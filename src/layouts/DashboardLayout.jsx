import { Outlet } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';

function DashboardLayout() {
    return (
        <div className="dashboard-shell">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;