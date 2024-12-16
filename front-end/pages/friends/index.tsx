import Header from '@components/header';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatService from '@services/ChatService';
import MessageService from '@services/MessageService';
import { Chat, FriendRequest, Message, User } from '@types';
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
import FriendRequestBox from '@components/friends/FriendRequestBox';
import CreateFriendRequest from '@components/friends/CreateFriendRequest';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";

const Friends: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [newFriendVisible, setNewFriendVisible] = useState<Boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('diddyfan');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleNewFriendPopup = () => {
        newFriendVisible ? setNewFriendVisible(false) : setNewFriendVisible(true);

    }

    const fetcher = (url: string) => {
        const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token;
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

    const { data: friendRequestData, isLoading: isFriendrequestLoading, error: friendrequestError } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/user/friendrequests`,

        fetcher
    );

    const { data: friendsData, isLoading: isFriendsLoading, error: friendsError } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/user/friends`,
        fetcher
    );

    useInterval(() => {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/user/friends`);
    }, 1000);

    return (
        <>
            {newFriendVisible ? (

                <div className={styles.createChatroomContainer} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        toggleNewFriendPopup();
                    }
                }}>
                    <CreateFriendRequest />
                </div>
            ) : (
                <div></div>
            )
            }
            <Head>
                <title>{t("friends.page.title")}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>{t("friends.page.title")}</h1>
                <div className={styles.chatroomContainer}>
                    <div className={styles.chatRoomsOverviewContainer}>
                        <div className={styles.chatroomsOverviewList}>
                            <table className={styles.FriendsOverviewTable}>
                                <thead>
                                    <tr>
                                        <th scope="col">{t("friends.page.overview-table")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isFriendsLoading ? (
                                        <tr>
                                            <td>{t("friends.page.loading")}</td>
                                        </tr>
                                    ) : friendsError ? (
                                        <tr>
                                            <td>{t("friends.page.error-loading")}</td>
                                        </tr>
                                    ) : friendsData && friendsData.length > 0 ? (
                                        friendsData.map((friend: User) => (
                                            <tr key={friend.id}>
                                                <td>{friend.username}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>{t("friends.page.no-friends")}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Button className={styles.addChatroomButton} onClick={toggleNewFriendPopup}> <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>{t("friends.page.add-friend-button")}</Button>
                    </div>
                    <div className={styles.chatRoomContentContainer}>
                        <div className={styles.chatRoomContent}>
                            {isFriendrequestLoading ? (
                                <p>{t("friends.page.friend-request.loading")}</p>
                            ) : friendrequestError ? (
                                <p>{t("friends.page.friend-request.error-loading")}</p>
                            ) : friendRequestData && friendRequestData.length > 0 ? (
                                friendRequestData.map((friendrequest: FriendRequest) => (
                                    <FriendRequestBox friendrequest={friendrequest} />
                                ))
                            ) : (
                                <p>{t("friends.page.friend-request.text")}</p>
                            )
                            }
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

export default Friends;
