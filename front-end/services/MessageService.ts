import { Message } from '@types';

const getMessages = async () => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + "/messages",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

const MessageService = {
    getMessages,
};

export default MessageService;