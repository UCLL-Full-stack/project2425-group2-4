import { User, Message, Chat } from '@types';
import React, { useState, useEffect } from 'react';
import styles from '@styles/home.module.css';
import MessageService from '@services/MessageService';
import { useTranslation } from "next-i18next";

type Props = {
    chat: Chat;
    messages: Message[];
    users: User[];
};

const ChatRoomData: React.FC<Props> = ({ chat, messages, users }) => {
    const { t } = useTranslation();

    const deleteMessage = async (message: Message) => {
        chat?.id !== undefined && MessageService.deleteMessage(Number(chat.id), message)
    }

    return (
        <>
            {/* <h1 className={styles.chatroomName}>{chat.name}</h1> */}
            <div className={styles.chatRoomContainer}>
                {messages.map((message, index) => (
                    <section key={index} className={styles.chatSection}>
                        <h2 className={styles.userName}>{message.messenger.username}</h2>
                        <h2 className={styles.dateTime}>
                            {new Date(message.timestamp).toLocaleString()}
                        </h2>
                        <p className={styles.chatMessages}>{message.text}</p>
                        <button className={styles.deleteButton} onClick={() => deleteMessage(message)}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                    </section>
                ))}
            </div>
        </>
    );
};

export default ChatRoomData;
