type ChatInput = {
    id?: number;
    name: string;
    createdAt: Date;
    messages?: MessageInput[];
    users?: UserInput[];
}

type MessageInput = {
    id?: number;
    text: string;
    messenger: { id: number };
    timestamp: Date;
}

type UserInput =  {
    id: number;
    username: string;
    email: string;
    password: string;
//    role: string; 
//    maybe later, as I dunno if it's useful?
//    later with security maybe e.g. "admin"
}


export {
    ChatInput,
    MessageInput,
    UserInput,
}