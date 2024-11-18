import { Chat } from "../model/chat";
import chatDb from "../repository/chat.db";
// import messagesDb from "../repository/messages.db";
// import usersDb from "../repository/users.db";
// import { ChatInput, MessageInput, UserInput } from "../types"; // The "Input type" aka lab-03 reference

const getAllChats = (): Chat[] => chatDb.getAllChats();

const getChatById = (id: number): Chat => {
    const chat = chatDb.getChatById({ id });
    if (!chat) throw new Error(`Chat with id ${id} does not exist.`);
    return chat;
};


// To be worked on, for now it's just on stand-by

// const createChat = ({
//     name,
//     createdAt,
//     messages: messageInput,
//     users: userInput,
// }: ChatInput): Chat => {

//     const creationTime = Date.now()

//     const existingSchedule = chatDb.getChatById({
//         chatId : ChatInput.id,
//     });

//     if (existingSchedule) throw new Error('This chat already exists.');

//     const chat = new Chat({ name, createdAt: [] });
//     return chatDb.createChat(chat);
// };

export default { 
    getAllChats,
    getChatById,
    //createChat,
};