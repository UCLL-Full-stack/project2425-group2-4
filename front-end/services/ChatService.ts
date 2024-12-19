import { Chat } from '@types';

const getChats = async () => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;

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

const getChatById = async (chatId: string) => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
    const result = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    if (result.ok) { return result.json(); }
    throw new Error('Failed to get chatroom');
};

const createChatroom = async ({ name, users }: Chat): Promise<Chat> => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;

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

const updateChatroom = async ({ name, id }: { name: string, id: string }): Promise<Chat> => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;

    const chat = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/chats/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, id }),
        }
    );

    if (chat.ok) { return chat.json(); }
    else { throw new Error('Failed to update chatroom'); }
}

const ChatService = {
    getChats,
    getChatById,
    createChatroom,
    updateChatroom
};

export default ChatService;
