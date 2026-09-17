import LinkHealthCard from './LinkHealthCard';
import TopDestinationsCard from './TopDestinationsCard';
import ProTipCard from './ProTipCard';
import styles from './QuickInsights.module.css';

function QuickInsights({ links = [], loading = false }) {
    return (
        <div className={styles.grid}>
            <ProTipCard loading={loading} />
            <TopDestinationsCard links={links} loading={loading} />
            <LinkHealthCard links={links} loading={loading} />
        </div>
    );
}

export default QuickInsights;
