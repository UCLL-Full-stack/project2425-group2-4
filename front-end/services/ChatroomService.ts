import { Chat } from '@types';

const getChats = async () => {
    let chats = await fetch(
        process.env.APIURL + "/chats",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
    return chats
};

const getChatroom: () => Promise<Chat> = async (): Promise<Chat> => {
    let chatroom: any = await fetch(
        `http://localhost:3000/chats/chat:7dmsznbtiygigl64g9rn`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

    console.log(chatroom)
    return chatroom
};

const ChatroomService = {
    getChats,
    getChatroom
};

export default ChatroomService;
