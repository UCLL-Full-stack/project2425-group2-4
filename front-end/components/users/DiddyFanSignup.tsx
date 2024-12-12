import { StatusMessage } from '@types';
import classNames from 'classnames'; // CSS aka front-end usage
import { useRouter } from 'next/router'; // proper usage of my routes within my back-end
import { useState } from 'react'; // react.js fun lol
import { setTimeout } from 'timers'; // Timeout for asynchronous tasks
import styles from '@styles/home.module.css';
import { User } from '@types';
import UserService from '@services/UserService';

const DiddyFanSignup: React.FC = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [email, setEmail] = useState('');

    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    // makes a list grouping up status messages, straight forward ex dee

    const noMoreErrorsPlz = () => {
        setNameError('');
        //setNameError(null); is wrong???? WTF???????????????
        // ??????????????????????????????
        setStatusMessages([]);
    };

    const checkPassword = (passwordToCheck: string) => {
        if (password !== passwordToCheck) {
            setPasswordError('Diddy smirks... You can\'t type the same thing twice?');
        }
        else {
            setPasswordError('');
            setVerifyPassword(passwordToCheck);
        }
    }

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
        }
        else if (password !== verifyPassword) {
            checkPassword(verifyPassword);
            return false;
        }
        else {
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
            setStatusMessages([
                { type: 'success', message: 'Diddy welcomes you to his party 😏. Redirecting...' },
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
            <h3 className={styles.loginHeader}>Sign Up</h3>
            {/* className= */}
            {statusMessages && (
                <div>
                    <ul>
                    </ul>
                </div>
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
                    <label className={styles.usernameLabel} htmlFor="nameInput">email</label>
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
                    <label className={styles.usernameLabel} htmlFor="nameInput">username</label>
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
                    <label className={styles.passwordLabel} htmlFor="nameInput">password</label>
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
                    <label className={styles.passwordLabel} >Confirm Password</label>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                </div>


                <button
                    className={styles.submitButton}
                    type="submit"
                >
                    Sign up
                </button>

                <div className={styles.signupLinkContainer}>
                    <a href="/login">Log In</a>
                </div>
            </form>
        </>
    );
};

export default DiddyFanSignup;
