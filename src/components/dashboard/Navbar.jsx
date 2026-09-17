import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link2, LayoutDashboard, BarChart2, Settings, LogOut, ChevronDown, User, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../hooks/UseAuth';
import styles from './Navbar.module.css';
import toast from 'react-hot-toast';

const NAV_LINKS = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Links', to: '/dashboard/my-links', icon: LinkIcon },
    { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart2 },
    // { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            navigate('/');
            await logout();
            toast.success('Logged out');
        } catch {
            toast.error('Logout failed');
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className={styles.navbar}>
            <div className={styles.inner}>

                <Link to="/dashboard" className={styles.logo}>
                    <div className={styles.logoIcon}><Link2 size={18} /></div>
                    <span className={styles.logoText}>Ziplify</span>
                </Link>

                <nav className={styles.nav}>
                    {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${styles.navLink} ${location.pathname === to ? styles.active : ''}`}
                        >
                            <Icon size={15} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.userArea} ref={dropdownRef}>
                    <button
                        className={styles.avatarBtn}
                        onClick={() => setDropdownOpen(p => !p)}
                        id="navbar-user-menu"
                        aria-expanded={dropdownOpen}
                    >
                        <div className={styles.avatar}>{initials}</div>
                        <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                        <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <p className={styles.dropdownName}>{user?.name}</p>
                                <p className={styles.dropdownEmail}>{user?.email}</p>
                            </div>
                            <div className={styles.dropdownDivider} />
                            <Link to="/dashboard/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                                <User size={14} /> Profile
                            </Link>
                            <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}

export default Navbar;
