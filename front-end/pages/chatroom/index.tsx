import Header from '@components/header';
import Head from 'next/head';
import { Component, useEffect, useState } from 'react';
// import ChatroomService from '@services/ChatroomService';
// import ChatroomData from '@components/chatrooms/ChatRoomData';
import { Chat } from '@types';
import { error } from 'console';
import styles from '@styles/home.module.css';

const Chatroom: React.FC = () => {
    // const chatroom = useState<Array<Chatroom>>();

    // useEffect(() => {
    //     getChatroom();
    // }, []);

    // const getChatroom = async() => {
    //     const response = await ChatroomService.getChatroom();
    //     const chatroom = await response.json();
    // }

    return (
        <>
            <Head>
                <title>Chatrooms</title>
            </Head>
            <Header />
            <main>
                <h1 className={styles.chatroomName}>Chatroom name</h1>
                <section>
                    <h2>Username, Datetime</h2>
                    <p>yappa yappa yappa yappa</p>
                </section>
            </main>
        </>
    );
};

export default Chatroom;
