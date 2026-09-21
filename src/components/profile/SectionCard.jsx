import styles from './SectionCard.module.css';

export function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardIcon}><Icon size={16} /></span>
                <h2 className={styles.cardTitle}>{title}</h2>
            </div>
            {children}
        </div>
    );
}

export function FieldRow({ label, value, action }) {
    return (
        <div className={styles.fieldRow}>
            <div>
                <p className={styles.fieldLabel}>{label}</p>
                <p className={styles.fieldValue}>{value}</p>
            </div>
            {action && <div className={styles.fieldAction}>{action}</div>}
        </div>
    );
}

export function Divider() {
    return <div className={styles.divider} />;
}
