import Header from '@components/header';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatRoomData from '@components/chatrooms/ChatRoomData';
import ChatroomService from '@services/ChatroomService';
import MessageService from '@services/MessageService';
import { Chat, Message, User } from '@types';
import { error } from 'console';
import styles from '@styles/home.module.css';

const Chatroom: React.FC = () => {
    const [chatroom, setChatroom] = useState<Chat | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchChatroom();
    }, []);

    const fetchChatroom = async () => {
        try {
            const response = await ChatroomService.getChatroom();
            const chat = await response.json();
            setChatroom(chat[0])
        } catch (error) {
            console.error('Error fetching chatroom:', error);
        }
    }


    return (
        <>
            <Head>
                <title>Chatrooms</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.chatroomName}>Chatroom name</h1>
                <div className={styles.chatRoomContainer}>
                    {
                        chatroom?.messages?.length ? (chatroom.messages.map((message: Message) => (<section key={message.id} className={styles.chatSection}>
                            <h4 className={styles.userName}>{message.messenger.username}</h4>
                            <h4 className={styles.dateTime}>{message.timestamp.toLocaleString()}</h4>
                            <div className={styles.chatMessages}>
                                <p>{message.text}</p>
                            </div>
                        </section>
                        ))) : (<p>No messages to display</p>)
                    }
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
