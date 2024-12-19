import { Message } from '@types';

const postMessage = async (chatId: number, message: Message): Promise<Message> => {
    console.log('API call made for:', message); // Debugging
    console.log(JSON.stringify(message));
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        throw new Error('Failed to post message exdee');
    }

    return response.json();
};


const deleteMessage = async (chatId: number, message: Message): Promise<Message> => {
    console.log(JSON.stringify(message)); // debugging
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message), // not sure if this is required?
    });

    if (!response.ok) {
        throw new Error('Failed to delete message. lol.');
    }

    return response.json();
};


const MessageService = {
    postMessage,
    deleteMessage,
};

export default MessageService;