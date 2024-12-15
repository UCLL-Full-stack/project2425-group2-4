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

const Chatrooms: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

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

    const { data: FriendRequestData, isLoading: isFriendrequestLoading, error: friendrequestError } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/friendrequests`,

        fetcher
    );

    const { data: friendsData, isLoading: isFriendsLoading, error: friendsError } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/friends`,
        fetcher
    );

    /* useInterval(() => {
         if (chatId) {
             mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`);
         }
         mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
     }, 1000);
     const selectChat = (chat: Chat) => {
         router.push(`/chats/${chat.id}`);
     };*/

    return (
        <>
            <Head>
                <title>Friends</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Friends</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        <div className={styles.chatroomsOverviewList}>
                            <table className={styles.overviewTable}>
                                <thead>
                                    <tr>
                                        <th scope="col">Friends</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friendsData && friendsData.map((friend: User, index: number) => (
                                        <>
                                            <tr key={index}>
                                                <td>{friend.username}</td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={styles.chatRoomContentContainer}>
                        <div className={styles.chatRoomContent}>
                            <p>Diddy loves making friends.... you might too ;)</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Chatrooms;
