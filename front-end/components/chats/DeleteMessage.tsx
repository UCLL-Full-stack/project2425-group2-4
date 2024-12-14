import React, { useState, useEffect } from 'react';
import { Message, User } from '@types';
import MessageService from '@services/MessageService';
import styles from '@styles/home.module.css';

type Props = {
    chatId: number;
    className?: string;
    message: Message;
}

const DeleteMessage: React.FC<Props> = ({ chatId, className, message }) => {
    const [diddyFan, setDiddyFan] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        setDiddyFan(JSON.parse(sessionStorage.getItem('diddyfan') || ''));
        console.log(diddyFan);
    });

    const validate = () => {
        let result = true;
        setError(null);

        return result;
    };

    // const deleteMessage = async ()   hm

    return (
        <div className={className}>
            <button onClick={() => MessageService.deleteMessage(chatId, message)}>Delete</button>
        </div>
    );
}

export default DeleteMessage;