import Head from "next/head";
import Header from "@components/header";
import DiddyFanSignup from "@components/users/DiddyFanSignup";
import styles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";

const Login: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("signup.page.title")}</title>
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

export const getServerSideProps = async (context: GetServerSidePropsContext)  => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Login;
