type Role = 'admin' | 'moderator' | 'user';

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

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role; 
}

type AuthenticationResponse = {
    token: string;
    username: string;
    email: string;
    role: string;
};


export {
    Role,
    ChatInput,
    MessageInput,
    UserInput,
    AuthenticationResponse
}
