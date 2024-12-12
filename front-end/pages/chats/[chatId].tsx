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
    const [diddyFan, setDiddyFan] = useState<User | null>(null); // typescript logic lol? WHY NOT JUST 'NULL'???????
    // THIS SHIT MAKES ME SKIZO
    const router = useRouter();
    const { chatId } = router.query;

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR(process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`, fetcher);
    // I dunno why that shouldn't work? might be missing something tbhh

    useInterval(() => {
        mutate(process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`);
    }, 1000); // ok

    const handleNewMessage = (message: Message) => {
        if (data) {
            setChat({
                ...data,
                messages: [...data.messages, message],
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
                <title>{data ? data?.name : 'Chat does not exist'}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{data ? data.name : 'Chat does not exist'}</h1>
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
                            {data? (
                                <ChatData
                                    chat={data}
                                    messages={data?.messages || []}
                                    users={data?.users || []}
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
