import { Chat } from '@types';

const getChats = async () => {
    const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token; // I FUCKING HATE THIS

    return fetch(
        process.env.NEXT_PUBLIC_API_URL + "/chats",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
};

const getChatById = (chatId: string) => {
    const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token; // I FUCKING HATE THIS

    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
};

const createChatroom = async ({ name, users }: Chat): Promise<Chat> => {
    const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token;

    const chat = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/chats",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, users }),
        });

    if (chat.ok) { return chat.json(); }
    else { throw new Error('Failed to create chatroom'); }
}

const ChatService = {
    getChats,
    getChatById,
    createChatroom
};

export default ChatService;
