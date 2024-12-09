import Head from "next/head";
import Header from "@components/header";
import DiddyFanSignup from "@components/users/DiddyFanSignup";
import styles from '@styles/home.module.css';

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>Diddy fan Signup :)</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.loginPageBox}>
                    <DiddyFanSignup />
                </div>
            </main>
        </>
    );
};

export default Login;
