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
import CreateChatroom from '@components/chats/CreateChatroom';
import { Button } from '@headlessui/react';
//import ChatData from '@components/chats/ChatData';

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from 'next';

const Chatrooms: React.FC = () => {
    const router = useRouter();
    const { chatId } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [newChatVisible, setNewChatVisible] = useState<Boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('diddyfan');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleNewChatPopup = () => {
        newChatVisible ? setNewChatVisible(false) : setNewChatVisible(true);

    }

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
    const selectChat = (chat: Chat) => {
        router.push(`/chats/${chat.id}`);
    };

    return (
        <>
            {newChatVisible ? (

                <div className={styles.createChatroomContainer} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        toggleNewChatPopup();
                    }
                }}>
                    <CreateChatroom />
                </div>
            ) : (
                <div></div>
            )
            }
            <Head>
                <title>Diddyscord Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Diddyscord Chatrooms</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        <div className={styles.chatroomsOverviewList}>
                            {chatsData && chatsData.length > 0 ? (
                                <ChatOverviewData chats={chatsData} selectChat={selectChat} />
                            ) : (
                                <p>No chatrooms active.</p>
                            )}
                        </div>
                        <Button className={styles.addChatroomButton} onClick={toggleNewChatPopup}> <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>Add ChatRoom</Button>
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
                                <p>Choose a Chatroom or make one for diddy... Diddy will be happy if you do ;)</p>
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

export const getServerSideProps = async (context: GetServerSidePropsContext)  => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Chatrooms;
