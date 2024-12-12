import Header from '@components/header';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatService from '@services/ChatService';
import MessageService from '@services/MessageService';
import { Chat, Message, User } from '@types';
import { error } from 'console';
import styles from '@styles/home.module.css';
import ChatOverviewData from '@components/chats/ChatOverview';
import { useRouter } from 'next/router';
import ChatData from '@components/chats/ChatData';
import PostMessage from '@components/chats/PostMessage';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';
//import ChatData from '@components/chats/ChatData';

const Chatroom: React.FC = () => {
    //const [chats, setChats] = useState<Chat[] | null>(null);
    const router = useRouter();
    const { chatId } = router.query;
    const [chat, setChat] = useState<Chat | null>(null);

    // useEffect(() => {
    //     fetchChats();
    // }, []);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const fetchAllChats = async () => {
        try {
            const response = await ChatService.getChats();

            if (!response.ok) {
                throw new Error('Failed to fetch chats');
            }

            const chats = await response.json();
            console.log(chats);
            return chats;
        } catch (error) {
            console.error('Error fetching chatrooms', error);
        }
    };

    const { data, isLoading, error } = useSWR(process.env.NEXT_PUBLIC_API_URL + '/chats', fetcher);
    // I dunno why that shouldn't work? might be missing something tbhh

    useInterval(() => {
        mutate(process.env.NEXT_PUBLIC_API_URL + '/chats');
    }, 1000); // ok

    const selectChat = (chat: Chat) => {
        router.push(`/chats/${chat.id}`);
        setChat(chat);
    };

    return (
        <>
            <Head>
                <title>Diddyscord Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Diddyscord Chatrooms</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        {data && data.length > 0 ? (
                            <ChatOverviewData chats={data} selectChat={selectChat} />
                        ) : (
                            <p>No chatrooms active.</p>
                        )}
                    </div>
                    <div className={styles.chatRoomContentContainer}>
                        <div className={styles.chatRoomContent}>
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
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Type your message and press Enter"
                                        className={styles.chatInput}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Chatroom;
