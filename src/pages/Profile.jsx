import { useAuth } from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import styles from './Profile.module.css';

import AccountInfo from '../components/profile/AccountInfo';
import SecuritySection from '../components/profile/SecuritySection';
import AccountStatus from '../components/profile/AccountStatus';
import QuickLinks from '../components/profile/QuickLinks';
import DangerZone from '../components/profile/DangerZone';

function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function Profile() {
    const { user, setUser, logout, clearSession } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            navigate('/');
            await logout();
            toast.success('Logged out');
        } catch {
            toast.error('Logout failed');
        }
    };

    const handleDeleteAccount = async (password) => {
        try {
            await api.delete('/user/account', { data: { password } });
            clearSession();
            navigate('/');
            toast.success('Account deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete account');
            throw err;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.hero}>
                    <div className={styles.avatarWrap}>
                        <div className={styles.avatarRing} />
                        <div className={styles.avatar}>{getInitials(user?.name)}</div>
                    </div>
                    <div className={styles.heroMeta}>
                        <h1 className={styles.heroName}>{user?.name || '—'}</h1>
                        <p className={styles.heroEmail}>{user?.email || '—'}</p>
                        <span className={styles.heroBadge}>
                            <Shield size={11} /> Verified account
                        </span>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={15} /> Log out
                    </button>
                </div>

                <div className={styles.grid}>
                    <div className={styles.leftCol}>
                        <AccountInfo user={user} setUser={setUser} />
                        <SecuritySection />
                    </div>
                    <div className={styles.rightCol}>
                        <AccountStatus />
                        <QuickLinks />
                    </div>
                </div>

                <DangerZone onDeleteAccount={handleDeleteAccount} />

            </div>
        </div>
    );
}

export default Profile;