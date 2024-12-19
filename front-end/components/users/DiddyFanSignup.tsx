import { StatusMessage } from '@types';
import classNames from 'classnames'; // CSS aka front-end usage
import { useRouter } from 'next/router'; // proper usage of my routes within my back-end
import { useState } from 'react'; // react.js fun lol
import { setTimeout } from 'timers'; // Timeout for asynchronous tasks
import styles from '@styles/home.module.css';
import { User } from '@types';
import Link from 'next/link';
import UserService from '@services/UserService';
import { useTranslation } from 'next-i18next';

const DiddyFanSignup: React.FC = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [statusMessage, setStatusMessage] = useState<StatusMessage>();
    // makes a list grouping up status messages, straight forward ex dee

    const { t } = useTranslation();
    const { locale } = useRouter(); // necessary for translated links

    const noMoreErrorsPlz = () => {
        setNameError('');
        setEmailError('');
        //setNameError(null); is wrong???? WTF???????????????
        // ??????????????????????????????
        setStatusMessage({ type: 'success', message: '' })
    };

    const checkPassword = (passwordToCheck: string) => {
        if (password !== passwordToCheck) {
            setPasswordError(t('signup.component.validation.diddy.password.error'));
        } else {
            setPasswordError('');
            setVerifyPassword(passwordToCheck);
        }
    };

    const validate = (): boolean => {
        let result = true;

        if (!name && name.trim() === '') {
            setNameError(t('signup.component.validation.diddy.name.error'));
            result = false;
        } else {
            setNameError('');
        }

        if (!email && email.trim() === '') {
            setEmailError(t('signup.component.validation.diddy.email.error'));
        }

        if (!password && password.trim() === '') {
            setPasswordError(t('signup.component.validation.diddy.password.empty'));
            result = false;
        } else if (password !== verifyPassword) {
            checkPassword(verifyPassword);
            return false;
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
            const user = {
                username: name,
                password,
                email,
                role: 'user',
            };
            const response = await UserService.signupDiddyFan(user);
            // if (!data.ok) {
            //     setStatusMessages(await data.json())
            //     return
            // }
            // const user: User = await data.json();
            // sessionStorage.setItem('diddyfan', user.username);
            // if (user.id) sessionStorage.setItem('diddyid', user.id.toString());
            // if (user.token) sessionStorage.setItem('diddytoken', user.token);

            if (response.status !== 200) {
                setStatusMessage(
                    { type: 'error', message: t('signup.component.validation.diddy.signup.error') },
                );
                return;
            }
            const data = await response.json();

            sessionStorage.setItem(
                'diddyfan',
                JSON.stringify({
                    username: data.username,
                    role: data.role,
                })
            );
            sessionStorage.setItem(
                'token',
                JSON.stringify({
                    token: data.token,
                })
            );
            console.log(data.token);

            setStatusMessage(
                { type: 'success', message: t('signup.component.validation.diddy.signup.success') },
            );

            setTimeout(() => {
                router.push('/');
            }, 2500);
        } catch (e) {
            setStatusMessage(
                { type: 'error', message: t('signup.component.validation.diddy.signup.error') },
            );
            console.log(e);
            return e;
        }
    };

    return (
        <>
            <h3 className={styles.loginHeader}>{t('signup.component.header')}</h3>
            {/* className= */}
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
            <form className={styles.loginContainer} onSubmit={handleSubmission}>
                <div className={styles.inputContainer}>
                    <input
                        id="nameInput"
                        type="email"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}
                    //className=
                    />
                    <label className={styles.usernameLabel} htmlFor="nameInput">
                        {t('signup.component.labels.email')}
                    </label>
                </div>
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
                        {t('signup.component.labels.username')}
                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <input
                        id="nameInput"
                        type="password"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                        className={styles.passwordInput}
                    />
                    <label className={styles.passwordLabel} htmlFor="nameInput">
                        {t('signup.component.labels.password')}
                    </label>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <input
                        id="nameInput"
                        type="password"
                        required
                        onChange={(event) => checkPassword(event.target.value)}
                        className={styles.passwordInput}
                    />
                    <label className={styles.passwordLabel}>
                        {t('signup.component.labels.confirmpassword')}
                    </label>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                </div>

                <button className={styles.submitButton} type="submit">
                    {t('signup.component.button')}
                </button>

                <div className={styles.signupLinkContainer}>
                    <Link href="/login" locale={locale}>
                        {t('signup.component.login-link')}
                    </Link>
                </div>
            </form>
        </>
    );
};

export default DiddyFanSignup;
