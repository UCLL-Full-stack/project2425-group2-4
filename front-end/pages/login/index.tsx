import Head from "next/head";
import Header from "@components/header";
import DiddyFanLogin from "@components/users/DiddyFanLogin";
import styles from '@styles/home.module.css';

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>Diddy fan Login :)</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.loginPageBox}>
                    <DiddyFanLogin />
                </div>
            </main>
        </>
    );
};

export default Login;
