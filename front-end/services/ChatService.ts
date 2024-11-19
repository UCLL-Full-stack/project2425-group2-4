import { Chat } from '@types';

const getChats = async () => {
    let chats = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/chats",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
    return chats;
};

const getChatById = (chatId: string) => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
};  

const ChatService = {
    getChats,
    getChatById,
};

export default ChatService;
