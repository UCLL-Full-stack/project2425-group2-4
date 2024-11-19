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
//import ChatData from '@components/chats/ChatData';

const Chatroom: React.FC = () => {
    const [chats, setChats] = useState<Chat[] | null>(null);
    const router = useRouter();
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

    const selectChat = (chat: Chat) => {
        router.push(`/chats/${chat.id}`);
    };

    return (
        <>
            <Head>
                <title>Diddyscord Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Diddyscord Chatrooms</h1>
                <div className={styles.chatRoomContainer}>
                    {chats && chats.length > 0 ? (
                        <ChatOverviewData chats={chats} selectChat={selectChat} />
                    ) : (
                        <p>No chatrooms active.</p>
                    )}
                </div>
            </main>
        </>
    );
};

export default Chatroom;
