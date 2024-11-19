import React, { useState } from 'react';
import { Message, User } from '@types';
import MessageService from '@services/MessageService';
import styles from '@styles/home.module.css';

type Props = {
    chatId: string;
    user: User;
    className?: string;
    onMessagePosted: (message: Message) => void; // I KNEW I WAS MISSING SOMETHING
};

const PostMessage: React.FC<Props> = ({ chatId, user, className, onMessagePosted}) => {
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            try {
                const newMessage: Message = {
                    id: '', // Generate or assign an ID as needed
                    text,
                    messenger: user,
                    timestamp: new Date(),
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
