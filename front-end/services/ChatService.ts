import { Chat } from '@types';

const getChats = async () => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + "/chats",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
};

const getChatById = (chatId: string) => {
    //const token = JSON.parse(sessionStorage.getItem('diddyfan') || '')?.token; // I FUCKING HATE THIS

    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                //Authorization: `Bearer ${token}`
            }
        })
};  

const ChatService = {
    getChats,
    getChatById,
};

export default ChatService;
