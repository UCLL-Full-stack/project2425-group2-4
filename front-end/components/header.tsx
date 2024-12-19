import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@types';

import { useTranslation } from 'next-i18next';
import Language from './language/Language';

const Header: React.FC = () => {
    const [diddyfan, setDiddyFan] = useState<User | null>(null);
    const router = useRouter();

    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('diddyfan');
        if (storedUser) {
            setDiddyFan(JSON.parse(storedUser));
        }
        console.log(diddyfan);
    }, []);
    //(event) is wrong... have to figure out why
    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        sessionStorage.removeItem('diddyfan');
        // sessionStorage.removeItem("diddyId");
        // sessionStorage.removeItem("diddyToken");
        setDiddyFan(null);
        setTimeout(() => {
            router.push('/');
        }, 500);
    };
    // Extra information regarding why it should be calling event like this:
    // " The error "Parameter 'event' implicitly has an 'any' type" occurs because TypeScript
    //   requires explicit type annotations for function parameters when the noImplicitAny compiler option
    //   is enabled. This option is often enabled by default in TypeScript configurations to ensure type safety. "
    // The event also depends on which html element we're talking about, so make sure to specify this part.

    return (
        <header>
            <nav id="navbar">
                <div className={styles.navwrapper}>
                    <ul>
                        <li>
                            <div className={styles.bannerlogo}>
                                <img
                                    src="/images/diddyscordLogo.png"
                                    alt="banner logo"
                                    className={styles.bannerlogo}
                                />
                            </div>
                            <a id={styles.diddyscordLogo}>{t('header.diddyscord-logo')}</a>
                        </li>
                        <li>
                            <Link href="/">{t('header.links.home')}</Link>
                        </li>
                        {!diddyfan ? (
                            <> </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/chats">{t('header.links.chats')}</Link>
                                </li>
                                <li>
                                    <Link href="/friends">{t('header.links.friends')}</Link>
                                </li>
                            </>
                        )}
                        <li>
                            {!diddyfan ? (
                                <Link href="/login">{t('header.links.login')}</Link>
                            ) : (
                                <>
                                    <a href="login" onClick={handleLogout}>
                                        {t('header.links.logout.anchor')}
                                    </a>
                                    <li>
                                        {t('header.links.logout.username')} "{diddyfan?.username}"!
                                    </li>
                                </>
                            )}
                        </li>
                        <Language />
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
