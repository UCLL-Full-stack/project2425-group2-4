import Header from "@components/header";
import Head from "next/head";
import { Component, useEffect, useState } from "react";
import ChatroomService from "@services/ChatroomService";
import { Chat } from "@types";
import ChatroomData from "@components/chatrooms/ChatRoomData";
import { error } from "console";



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
            <title>Chatroom</title>
        </Head>
        <Header />
            <main>
                <h1>Chatroom name</h1>
                <section>
                    <h2>Username, Datetime</h2>
                    <p>yappa yappa yappa yappa</p>
                </section>
            </main>
    </>);
}