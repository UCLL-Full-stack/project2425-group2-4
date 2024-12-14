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

import ChatOverviewData from '@components/chats/ChatOverview';
import ChatData from '@components/chats/ChatData';
import PostMessage from '@components/chats/PostMessage';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';

const Chatroom: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { chatId } = router.query;

    useEffect(() => {
        const storedUser = sessionStorage.getItem('diddyfan');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetcher = (url: string) => {
        const token = user?.token;
        if (!token) {
            throw new Error('No token found');
        }
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());
    };

    const { data: chatData, isLoading: isChatLoading, error: chatError } = useSWR(
        chatId ? `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}` : null,
        fetcher
    );

    const { data: chatsData, isLoading: isChatsLoading, error: chatsError } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/chats`,
        fetcher
    );

    useInterval(() => {
        if (chatId) {
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`);
        }
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
    }, 1000);

    const handleNewMessage = (message: Message) => {
        if (chatData) {
            setChat({
                ...chatData,
                messages: [...chatData.messages, message],
            });
        }
    };

    const selectChat = (chat: Chat) => {
        router.push(`/chats/${chat.id}`);
        setChat(chat);
    };

    return (
        <>
            <Head>
                <title>{chatData ? chatData?.name : 'Chat does not exist'}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{chatData ? chatData.name : 'Chat does not exist'}</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        {chatsData && chatsData.length > 0 ? (
                            <ChatOverviewData chats={chatsData} selectChat={selectChat} />
                        ) : (
                            <p>No chatrooms active.</p>
                        )}
                    </div>
                    <div className={styles.chatRoomContentContainer}>
                        <div className={styles.chatRoomContent}>
                            {chatData ? (
                                <ChatData
                                    chat={chatData}
                                    messages={chatData?.messages || []}
                                    users={chatData?.users || []}
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
                                    chatId={Number(chatId)}
                                    className={styles.chatInput}
                                    onMessagePosted={handleNewMessage}
                                />
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Chatroom;
