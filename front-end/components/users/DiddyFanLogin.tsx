import { StatusMessage, User } from '@types';
import classNames from 'classnames'; // CSS aka front-end usage
import { useRouter } from 'next/router'; // proper usage of my routes within my back-end
import { useState } from 'react'; // react.js fun lol
import { setTimeout } from 'timers'; // Timeout for asynchronous tasks
import styles from '@styles/home.module.css';

const DiddyFanLogin: React.FC = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    // makes a list grouping up status messages, straight forward ex dee

    const noMoreErrorsPlz = () => {
        setNameError('');
        //setNameError(null); is wrong???? WTF???????????????
        // ??????????????????????????????
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;

        if (!name && name.trim() === '') {
            setNameError('Diddy is not happy... type in a name or else...');
            result = false;
        } else {
            setNameError('');
        }

        if (!password && password.trim() === '') {
            setPasswordError('Diddy is not happy... type in a password or else...');
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
            const data = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: name,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!data.ok) {
                setStatusMessages(await data.json())
                return
            }
            const user: User = await data.json();
            sessionStorage.setItem('diddyfan', user.username);
            sessionStorage.setItem('diddyId', user.id);
            sessionStorage.setItem('token', user.token);
            setStatusMessages([
                { type: 'success', message: 'Diddy has missed you babe. Redirecting...' },
            ]);
            setTimeout(() => {
                router.push('/');
            }, 2500);
        } catch (e) {
            console.log(e);
            return
        }
    };

    return (
        <>
            <h3 className={styles.loginHeader}>Login</h3>
            <form className={styles.loginContainer} onSubmit={handleSubmission}>
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
                    <label className={styles.usernameLabel} htmlFor="nameInput">username</label>
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
                    <label className={styles.passwordLabel} htmlFor="nameInput">password</label>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                </div>

                <button
                    className={styles.submitButton}
                    type="submit"
                >
                    Login
                </button>

                <div className={styles.signupLinkContainer}>
                    <a href="/signup">Sign up</a>
                </div>
            </form>
        </>
    );
};

export default DiddyFanLogin;
