import Head from "next/head";
import Header from "@components/header";
import DiddyFanLogin from "@components/users/DiddyFanLogin";
import styles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";

const Login: React.FC = () => {
    const { t } = useTranslation();

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

export const getServerSideProps = async (context: GetServerSidePropsContext)  => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Login;
