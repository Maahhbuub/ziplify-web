import { Link } from 'react-router-dom';
import { Link2, LayoutDashboard, BarChart2, ChevronRight } from 'lucide-react';
import { SectionCard, Divider } from './SectionCard';
import styles from './QuickLinks.module.css';

const QUICK_LINKS = [
    { label: 'Dashboard', desc: 'Overview & stats',  to: '/my-dashboard',              icon: LayoutDashboard },
    { label: 'My Links',  desc: 'Manage your URLs',  to: '/my-dashboard/my-links',     icon: Link2           },
    // { label: 'Analytics', desc: 'Track performance', to: '/my-dashboard/analytics',    icon: BarChart2       },
];

function QuickLinks() {
    return (
        <SectionCard icon={Link2} title="Quick Links">
            <Divider />
            <div className={styles.list}>
                {QUICK_LINKS.map(({ label, desc, to, icon: Icon }) => (
                    <Link key={to} to={to} className={styles.item}>
                        <span className={styles.icon}><Icon size={15} /></span>
                        <span className={styles.text}>
                            <span className={styles.label}>{label}</span>
                            <span className={styles.desc}>{desc}</span>
                        </span>
                        <ChevronRight size={14} className={styles.arrow} />
                    </Link>
                ))}
            </div>
        </SectionCard>
    );
}

export default QuickLinks;
