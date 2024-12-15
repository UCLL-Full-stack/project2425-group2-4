import "@styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';


const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
}
                                        // I hate next, I hate react and I hate typescript for this 'any' BS.
export const getServerSideProps = async (context: GetServerSidePropsContext)  => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default appWithTranslation(App);