import { User, Message, Chat } from '@types';
import React from 'react';
import styles from '@styles/home.module.css';

type Props = {
    Chatroom: Chat;
    Messages: Message[];
    User: User;
};

const ChatRoomData: React.FC<Props> = ({ Chatroom, Messages, User }) => {
    return (
        <>
            <h1 className={styles.chatroomName}>{Chatroom.name}</h1>
            <div className={styles.chatRoomContainer}>
                {Messages.map((message, index) => (
                    <section key={index} className={styles.chatSection}>
                        <h2 className={styles.userName}>{User.username}</h2>
                        <h2 className={styles.dateTime}>
                            {new Date(message.timestamp).toLocaleString()}
                        </h2>
                        <p className={styles.chatMessages}>{message.text}</p>
                    </section>
                ))}
            </div>
        </>
    );
};

export default ChatRoomData;
