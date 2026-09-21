import { Shield } from 'lucide-react';
import { SectionCard, Divider } from './SectionCard';
import styles from './AccountStatus.module.css';

const STATUS_ITEMS = [
    { label: 'Account type', value: 'Free' },
    { label: 'Status', value: 'Active', highlight: true },
    { label: 'Short links', value: 'Unlimited' },
];

function AccountStatus() {
    return (
        <SectionCard icon={Shield} title="Account Status">
            <Divider />
            <div className={styles.list}>
                {STATUS_ITEMS.map(({ label, value, highlight }) => (
                    <div key={label} className={styles.row}>
                        <span className={styles.label}>{label}</span>
                        <span className={highlight ? styles.active : styles.value}>{value}</span>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

export default AccountStatus;