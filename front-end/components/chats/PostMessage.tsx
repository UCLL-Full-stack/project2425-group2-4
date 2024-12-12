import React, { useState, useEffect } from 'react';
import { Message, User } from '@types';
import MessageService from '@services/MessageService';
import styles from '@styles/home.module.css';

type Props = {
    chatId: number;
    //user: User;
    className?: string;
    onMessagePosted: (message: Message) => void; // I KNEW I WAS MISSING SOMETHING
};

const PostMessage: React.FC<Props> = ({ chatId, className, onMessagePosted }) => {
    const [text, setText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [diddyFan, setDiddyFan] = useState<User | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem('diddyfan');
        if (user) {
            setDiddyFan(JSON.parse(sessionStorage.getItem('diddyfan') || '')); // '' is correct what
        }
        //console.log(diddyFan);
    }, []);

    const validate = () => {
        let result = true;
        setError(null);

        if (!text.trim()) {
            result = false;
        }

        return result;
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (!validate()) {
                return;
            }

            if (!diddyFan) {
                setError('You must be logged in to post a message');
                return;
            }

            try {
                const newMessage: Message = {
                    text,
                    messenger: { username: diddyFan?.username },
                    timestamp: new Date(),
                    chatId: Number(chatId)
                };
                const postedMessage = await MessageService.postMessage(chatId, newMessage);
                setText(''); // clearing it out
                onMessagePosted(postedMessage);
            } catch (err) {
                console.log(err); // debugging
                setError('Failed to post message');
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message and press Enter"
                className={className}
            />
            {error && <p>{error}</p>}
        </div>
    );
};

export default PostMessage;
