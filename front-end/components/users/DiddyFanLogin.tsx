import { StatusMessage } from '@types';
import classNames from 'classnames'; // CSS aka front-end usage
import { useRouter } from 'next/router'; // proper usage of my routes within my back-end
import { useState } from 'react'; // react.js fun lol
import { setTimeout } from 'timers'; // Timeout for asynchronous tasks

const DiddyFanLogin: React.FC = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

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
            setNameError('Name is required');
            result = false;
        } else {
            setNameError('');
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

        sessionStorage.setItem('diddyfan', name);
        setStatusMessages([
            { type: 'success', message: 'Diddy has missed you babe. Redirecting...' },
        ]);
        setTimeout(() => {
            router.push('/');
        }, 2500);
    };

    return (
        <>
            <h3>Login</h3>
            {/* className= */}
            {statusMessages && (
                <div>
                    <ul>
                        {statusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={classNames({
                                    'text-red-800': type === 'error',
                                    'text-green-800': type === 'success',
                                })}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmission}>
                <label htmlFor="nameInput">Diddy Fan:</label> 
                {/* className= */}
                <div>
                    <input 
                    id="nameInput"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    //className=
                    />
                    {nameError && <p className='text-red-800'>{nameError}</p>}
                </div>

                <button
                    //className=
                    type="submit"
                >
                    Login
                </button>
            </form>
        </>
    );
};

export default DiddyFanLogin;
