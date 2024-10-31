import Link from 'next/link';
import styles from '@styles/home.module.css';

const Header: React.FC = () => {
    return (
        <header>
            <nav id="navbar">
                <div className={styles.navwrapper}>
                    <ul>
                        <li>
                            <div className={styles.bannerlogo}>
                                <img src="" alt="banner logo" className="banner-logo" />
                            </div>
                            <a id={styles.diddyscordLogo}>Diddyscord</a>
                        </li>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/chatroom">Chatrooms</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
