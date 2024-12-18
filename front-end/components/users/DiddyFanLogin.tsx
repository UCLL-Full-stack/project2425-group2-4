import { StatusMessage, User } from '@types';
import Link from 'next/link';
import classNames from 'classnames'; // CSS aka front-end usage
import { useRouter } from 'next/router'; // proper usage of my routes within my back-end
import { useState } from 'react'; // react.js fun lol
import { setTimeout } from 'timers'; // Timeout for asynchronous tasks
import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import { useTranslation } from 'next-i18next';

const DiddyFanLogin: React.FC = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [statusMessage, setStatusMessage] = useState<StatusMessage>();

    const router = useRouter();
    const { locale } = router; // necessary for translated links

    const { t } = useTranslation();

    const noMoreErrorsPlz = () => {
        setNameError('');
        setPasswordError('');
        //setNameError(null); is wrong???? WTF???????????????
        // ??????????????????????????????
        setStatusMessage(undefined)
    };

    const validate = (): boolean => {
        let result = true;

        if (!name && name.trim() === '') {
            setNameError(t('login.component.validation.diddy.name.error'));
            result = false;
        } else {
            setNameError('');
        }

        if (!password && password.trim() === '') {
            setPasswordError(t('login.component.validation.diddy.password.error'));
            result = false;
        } else {
            setPasswordError('');
        }

        return result;
    };
    //(event) IS WRONG???? BECAUSE IT HAS ANY TYPE?? WHAT
    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        noMoreErrorsPlz();

        if (!validate()) {
            return;
        }

        try {
            const user = { username: name, password };
            const response = await UserService.loginDiddyFan(user);
            if (response.status === 200) {
                const user = await response.json();
                sessionStorage.setItem(
                    'diddyfan',
                    JSON.stringify({
                        token: user.token,
                        username: user.username,
                        role: user.role,
                    })
                );
                // const user: User = await data.json();
                // sessionStorage.setItem('diddyfan', user.username);
                // sessionStorage.setItem('diddyId', user.id);
                // sessionStorage.setItem('token', user.token);
                setStatusMessage(
                    {
                        type: 'success',
                        message: t('login.component.validation.diddy.login.success'),
                    },
                );
                setTimeout(() => {
                    router.push('/');
                }, 2500);
            } else {
                setStatusMessage(
                    { type: 'error', message: t('login.component.validation.diddy.login.fail') },
                );
            }
        } catch (e) {
            console.log(e);
            setStatusMessage(
                {
                    type: 'error',
                    message: t('login.component.validation.diddy.login.error'),
                },
            );
        }
    };

    return (
        <>
            <h3 className={styles.loginHeader}>{t('login.component.header')}</h3>
            {statusMessage?.type === 'success' ? (
                <p>{statusMessage.message}</p>

            ) : statusMessage?.type === 'error' ? (
                <p
                    className={styles.errorMessage}
                >
                    {statusMessage.message}
                </p>
            ) : !statusMessage && (
                null
            )}
            < form className={styles.loginContainer} onSubmit={handleSubmission}>
                <div className={styles.inputContainer}>
                    <input
                        id="nameInput"
                        type="text"
                        value={name}
                        required
                        onChange={(event) => setName(event.target.value)}
                        className={styles.usernameInput}
                    //className=
                    />
                    {nameError && <p className={styles.errorMessage}>{nameError}</p>}
                    <label className={styles.usernameLabel} htmlFor="nameInput">
                        {t('login.component.labels.username')}
                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <input
                        id="passwordInput"
                        type="password"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                        className={styles.passwordInput}
                    />
                    <label className={styles.passwordLabel} htmlFor="nameInput">
                        {t('login.component.labels.password')}
                    </label>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                </div>

                <button className={styles.submitButton} type="submit">
                    {t('login.component.button')}
                </button>
                <div className={styles.signupLinkContainer}>
                    <Link href="/signup" locale={locale}>
                        {t('login.component.signup-link')}
                    </Link>
                </div>
            </form>
        </>
    );
};

export default DiddyFanLogin;
