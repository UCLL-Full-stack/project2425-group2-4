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
    return (
        <div className={className}>
            <p>yapping</p>
            {/* <p>Message: {message.content}</p> */}
            {/* <button onClick={() => MessageService.deleteMessage(chatId, message.id)}>Delete</button> */}
        </div>
    );
}

export default DeleteMessage;