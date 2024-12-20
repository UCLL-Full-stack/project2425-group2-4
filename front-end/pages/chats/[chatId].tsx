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

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from 'next';

const Chatroom: React.FC = () => {
    //const [chat, setChat] = useState<Chat | null>(null);
    const router = useRouter();
    const { chatId } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('diddyfan');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetcher = async (url: string) => {
        //console.log('Fetching data from:', url);
        const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
        if (!token) {
            throw new Error('No token found');
        }
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
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
            //console.log('Mutating chat data for chatId:', chatId);
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`);
        }
        //console.log('Mutating chats data');
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
        // mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`);
    }, 1000);

    const handleNewMessage = async (message: Message) => {
        if (chatId) {
            try {
                console.log(t("chatId.page.posting-message"), message);
                await MessageService.postMessage(Number(chatId), message);
                
            } catch (error) {
                console.error(t("chatId.page.fail-message"), error);
            }
        }
    };

    const selectChat = (chat: Chat) => {
        router.push(`/chats/${chat.id}`);
        //setChat(chat);
    };
    
    if (!user) {
        return <p className={styles.errorMessage}>{t("denied.access")}</p>
    }

    return (
        <>
            <Head>
                <title>{chatData ? chatData?.name : t("chatId.page.title")}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{chatData ? chatData.name : t("chatId.page.h1")}</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        {chatsData && chatsData.length > 0 ? (
                            <ChatOverviewData chats={chatsData} selectChat={selectChat} />
                        ) : (
                            <p>{t("chatId.page.overview-chats")}</p>
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
                                <p>{t("chatId.page.overview-chat-content")}</p>
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

export const getServerSideProps = async (context: GetServerSidePropsContext)  => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Chatroom;
