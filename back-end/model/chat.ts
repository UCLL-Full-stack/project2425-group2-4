import { Message } from "./message";
import { User } from "./user";
import {
    Chat as ChatPrisma,
    User as UserPrisma,
    Message as MessagePrisma,
} from '@prisma/client';

export class Chat {
    private id?: number;
    private name: string;
    private createdAt: Date;
    private messages?: Message[];
    private users?: User[];

    constructor(chat: {
        id?: number;
        name: string;
        createdAt: Date;
        messages?: Message[];
        users?: User[];
    }) {
        this.validate(chat); // Validation isn't sure for now
        // unless we change the way of this working completely & not making them undefinable
        // aka required messages & users for example, meaning to completely revamp our models.
        // which would take a lot of time & effort put into, so we need to take care of this

        this.id = chat.id;
        this.name = chat.name;
        this.createdAt = chat.createdAt;
        this.messages = chat.messages;
        this.users = chat.users;
    }

    // see above
    validate(chat: { name: string; createdAt: Date }) {
        if (!chat.name) {
            throw new Error('Name is required');
        }
        if (!chat.createdAt) {
            throw new Error('Date is incorrect');
        }
    }  

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getMessages(): Message[] | undefined {
        return this.messages;
    }

    getUsers(): User[] | undefined {
        return this.users;
    }

    // Posting the messages within the chatroom
    addMessage(message: Message) {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(message);
    }

    equals(chat: Chat): boolean {
        const usersEqual = (this.users?.length === chat.getUsers()?.length &&
        this.users?.every((user, index) => {
            const chatUser = chat.getUsers()?.[index];
            return chatUser ? user.equals(chatUser) : false;
        })) ?? false;

        const messagesEqual = (this.messages?.length === chat.getMessages()?.length &&
        this.messages?.every((message, index) => {
            const chatMessage = chat.getMessages()?.[index];
            return chatMessage ? message.equals(chatMessage) : false;
        })) ?? false;
        // making separate variables to avoid making the code messy & make it more readable,
        // it's mainly checking if the users & messages are equal to the getters of the type.
        // And since boolean can only be determined as True/False, this is the perfect solution.

        return (
            this.id === chat.getId() &&
            this.name == chat.getName() &&
            this.createdAt === chat.getCreatedAt() &&
            usersEqual && messagesEqual
        );
    }

    static from ({
        id,
        name,
        createdAt,
        messages,
        users,
    }: ChatPrisma & { users: UserPrisma[]; messages: MessagePrisma[]}) {
        return new Chat({
            id,
            users: (users || []).map((user) => User.from(user)),
            name,
            createdAt,
            messages: (messages || []).map(message => new Message({
                ...message,
                messenger: new User({ id: message.userId, username: '', email: '', password: '' })
            })),
        });
    }

}