import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from 'next';


const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("homepage.title")}</title>
                <meta name="description" content="Diddyscord chats" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <Header />
            <main className={styles.main}>
                <span>
                    {/* <Image
            src="/images/diddyscordlogo.png"
            alt="Diddyscord logo"
            className={styles.diddyscordLogo}
            width={50}
            height={50}
          /> */}
                    <h1>{t("homepage.h1")}</h1>
                </span>

                <div className={styles.description}>
                    <h5>
                    {t("homepage.h5")}
                    </h5>
                    <p>
                    {t("homepage.p")}
                    </p>
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

export default Home;
