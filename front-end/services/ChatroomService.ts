import { Chat } from '@types';

const getChatroom = async () => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + "/chatroom",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

const ChatroomService = {
    getChatroom,
};

export default ChatroomService;