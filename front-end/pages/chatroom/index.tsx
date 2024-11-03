import Header from '@components/header';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatRoomData from '@components/chatrooms/ChatRoomData';
import ChatroomService from '@services/ChatroomService';
import UserService from '@services/UserService';
import MessageService from '@services/MessageService';
import { Chat, Message, User } from '@types';
import { error } from 'console';
import styles from '@styles/home.module.css';

const Chatroom: React.FC = () => {
    const [chatroom, setChatroom] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchChatroom();
        fetchUser();
        fetchMessages();
    }, []);

    const fetchChatroom = async () => {
        try {
            const response = await ChatroomService.getChatroom();
            const data: Chat = await response.json();
            setChatroom(data);
        } catch (error) {
            console.error('Error fetching chatroom:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await UserService.getUser();
            const data: User = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await MessageService.getMessages();
            const data: Message[] = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Chatroom name</h1>
                <div className={styles.chatRoomContainer}>
                    <section className={styles.chatSection}>
                        <h4 className={styles.userName}>Tom</h4>
                        <h4 className={styles.dateTime}>timestamp: 14:00 18/02/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                        <h4 className={styles.userName}>Rick</h4>
                        <h4 className={styles.dateTime}>timestamp: 20:34 19/02/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                        <h4 className={styles.userName}>David</h4>
                        <h4 className={styles.dateTime}>timestamp: 21:00 19/02/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                        <h4 className={styles.userName}>Tom</h4>
                        <h4 className={styles.dateTime}>timestamp: 15:34 20/02/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                        <h4 className={styles.userName}>David</h4>
                        <h4 className={styles.dateTime}>timestamp: 10:02 24/03/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                        <h4 className={styles.userName}>John</h4>
                        <h4 className={styles.dateTime}>timestamp: 11:02 24/03/2024</h4>
                        <div className={styles.chatMessages}>
                            <p>
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa yappa
                                yappa yappa
                            </p>
                        </div>
                    </section>
                </div>
                <div>
                    <section className={styles.chatInputContainer}>
                        <img
                            src="../images/chatInput.png"
                            alt="img"
                            className={styles.chatInputImg}
                        />
                        <input type="text" className={styles.chatInput} />
                    </section>
                </div>
            </main>
        </>
    );

    // TO IMPLEMENT FOR THE DATABASE

    // return (
    //     <>
    //         <Head>
    //             <title>Chatrooms</title>
    //         </Head>
    //         <Header />
    //         <main className={styles.main}>
    //             {chatroom && user ? (
    //                 <ChatRoomData Chatroom={chatroom} Messages={messages} User={user} />
    //             ) : (
    //                 <p>Loading...</p>
    //             )}
    //             <div>
    //                 <section className={styles.chatInputContainer}>
    //                     <img
    //                         src="../images/chatInput.png"
    //                         alt="img"
    //                         className={styles.chatInputImg}
    //                     />
    //                     <input type="text" className={styles.chatInput} />
    //                 </section>
    //             </div>
    //         </main>
    //     </>
    // );
};

export default Chatroom;
