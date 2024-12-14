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
    const [isSubmitting, setIsSubmitting] = useState(false); // This prevents deduplicate calls with the state

    useEffect(() => {
        setDiddyFan(JSON.parse(sessionStorage.getItem('diddyfan') || ''));
        console.log(diddyFan);
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
            if (isSubmitting) return; // Prevent duplicate submissions by turning on the state
            setIsSubmitting(true);
    
            try {
                e.preventDefault(); // It's most definitely thanks to this.
                if (!validate()) return;
    
                const newMessage: Message = {
                    text,
                    messenger: { username: diddyFan?.username },
                    timestamp: new Date(),
                    chatId: Number(chatId),
                };
    
                await MessageService.postMessage(chatId, newMessage);
                setText('');
            } catch (err) {
                setError('Failed to post message');
            } finally {
                setIsSubmitting(false);
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
