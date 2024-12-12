import { Message } from '@types';

const postMessage = async (chatId: number, message: Message): Promise<Message> => {
    console.log('API call made for:', message); // Debugging
    console.log(JSON.stringify(message));
    const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token;

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


const MessageService = {
    //getMessages,
    postMessage,
};

export default MessageService;