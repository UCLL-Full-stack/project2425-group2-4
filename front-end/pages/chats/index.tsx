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
//import ChatData from '@components/chats/ChatData';

const Chatroom: React.FC = () => {
    const [chats, setChats] = useState<Chat[] | null>(null);
    const router = useRouter();
    const [chat, setChat] = useState<Chat | null>(null);
    //const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchChats();
    }, []);

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
                <title>Diddyscord Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Diddyscord Chatrooms</h1>
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
