import styles from './Home.module.css';

import Hero from '../components/home/Hero';

function Home() {
    
    return (
        <div className={`${styles.home}`}>
            <Hero />
        </div>
    )
}

export default Home;