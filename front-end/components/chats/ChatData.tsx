import { User, Message, Chat } from '@types';
import React, { useState, useEffect } from 'react';
import styles from '@styles/home.module.css';

type Props = {
    chat: Chat;
    messages: Message[];
    users: User[];
};

const ChatRoomData: React.FC<Props> = ({ chat, messages, users }) => {
    const [diddyFan, setDiddyFan] = useState<User | null>(null);
    // console.log('Rendering messages:', messages);
    // console.log('Rendering Chatroom');
    
    // useEffect(() => {
    //     setDiddyFan(JSON.parse(sessionStorage.getItem('diddyfan') || '')); // '' is correct what
    //     //console.log(diddyFan);
    // });

    return (
        <>
            {/* <h1 className={styles.chatroomName}>{chat.name}</h1> */}
            <div className={styles.chatRoomContainer}>
                {messages.map((message, index) => (
                    <section key={index} className={styles.chatSection}>
                        <h2 className={styles.userName}>{users.find(u => u.id === message.messenger.id)?.username}</h2>
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