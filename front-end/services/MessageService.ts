import { Message } from '@types';

// const getMessages = async () => {
//     return fetch(
//         process.env.NEXT_PUBLIC_API_URL + "/messages",
//         {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         }
//     );
// };

const postMessage = async (chatId: number, message: Message): Promise<Message> => {
    console.log(JSON.stringify(message));
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/chats/${chatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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