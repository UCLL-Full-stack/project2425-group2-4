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

const Chatroom: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [chats, setChats] = useState<Chat[] | null>(null); // for the overview of the other chats
    const router = useRouter();
    const { chatId } = router.query;

    const fetchChats = async () => {
        try {
            const response = await ChatService.getChats();
            const chats = await response.json();
            setChats(chats);
        } catch (error) {
            console.error('Error fetching chatrooms', error);
            setChats(null);
        }
    };

    useEffect(() => {
        fetchChats();
        if (chatId) {
            const getChatById = async () => {
                const response = await ChatService.getChatById(Number(chatId));
                const chatData = await response.json();
                setChat(chatData);
            };
            getChatById();
        }
    }, [chatId]);

    const newUser = {
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
    };

    const handleNewMessage = (message: Message) => {
        if (chat) {
            setChat({
                ...chat,
                messages: [...chat.messages, message],
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
                <title>{chat ? chat.name : 'Chat does not exist'}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{chat ? chat.name : 'Chat does not exist'}</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        {chats && chats.length > 0 ? (
                            <ChatOverviewData chats={chats} selectChat={selectChat} />
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
                                <PostMessage
                                    chatId={chatId ? Number(chatId) : 0}
                                    user={newUser}
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
