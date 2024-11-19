import Header from '@components/header';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatService from '@services/ChatService';
import MessageService from '@services/MessageService';
import { Chat, Message, User } from '@types';
import { error } from 'console';
import styles from '@styles/home.module.css';

import ChatData from '@components/chats/ChatData';
import PostMessage from '@components/chats/PostMessage';

const Chatroom: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const router = useRouter();
    const { chatId } = router.query;

    useEffect(() => {
        if (chatId) {
            const getChatById = async () => {
                const response = await ChatService.getChatById(chatId as string);
                const chatData = await response.json();
                setChat(chatData);
            };
            getChatById();
        }
    }, [chatId]);

    const newUser: User = {
        // Hard-coding as we aren't using login/security yet
        id: '1',
        username: 'guest3432',
        email: 'guest3432@gmail.com',
    };

    const handleNewMessage = (message: Message) => {
        if (chat) {
            setChat({
                ...chat,
                messages: [...chat.messages, message],
            });
        }
    };

    return (
        <>
            <Head>
                <title>{chat ? chat.name : 'Chat does not exist'}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{chat ? chat.name : 'Chat does not exist'}</h1>
                <div className={styles.chatRoomContainer}>
                    {chat ? (
                        <ChatData
                            chat={chat}
                            messages={chat?.messages || []}
                            users={chat?.users || []}
                        />
                    ) : (
                        <p>No messages to be displayed.</p>
                    )}
                </div>
                <div>
                    <section className={styles.chatInputContainer}>
                        <img
                            src="../images/chatInput.png"
                            alt="img"
                            className={styles.chatInputImg}
                        />
                        <PostMessage
                            chatId={chatId as string}
                            user={newUser}
                            className={styles.chatInput}
                            onMessagePosted={handleNewMessage}
                        />
                    </section>
                </div>
            </main>
        </>
    );
};

export default Chatroom;
