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
                        username: user.username,
                        role: user.role,
                    })
                );
                sessionStorage.setItem(
                    'token',
                    JSON.stringify({
                        token: user.token
                    })
                );
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

    // Table for logging in purposes
    const users = [
        { username: 'frans', password: 'frans123', role: 'user' },
        { username: 'jan', password: 'jan123', role: 'moderator' },
        { username: 'frits', password: 'frits123', role: 'user' },
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'yamaha46', password: 'R6fan99', role: 'admin'},
        { username: 'broski21', password: 'nuggetslovr6', role: 'moderator'},
        { username: 'gentleman43', password: 'test123', role: 'user'},
    ];

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

            <table className={styles.userTable}>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );
};

export default DiddyFanLogin;
