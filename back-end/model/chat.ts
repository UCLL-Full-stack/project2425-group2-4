import { Message } from "./message";
import { User } from "./user";
import { Role } from "../types";
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

    constructor(chat: {
        id?: number;
        name: string;
        createdAt: Date;
        messages?: Message[];
    }) {
        this.validate(chat);

        this.id = chat.id;
        this.name = chat.name;
        this.createdAt = chat.createdAt;
        this.messages = chat.messages;
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

    // Posting the messages within the chatroom
    addMessage(message: Message) {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(message);
    }

    equals(chat: Chat): boolean {
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
            messagesEqual
        );
    }

    static from({
        id,
        name,
        createdAt,
        messages,
        users,
    }: ChatPrisma & { users: UserPrisma[]; messages: MessagePrisma[] }) {
        // console.log('Users:', users);
        // console.log('Messages:', messages);
        return new Chat({
            id,
            name,
            createdAt,
            messages: (messages || []).map(message => {
                const messenger = users.find(user => user.id === message.userId);
                if (!messenger) {
                    throw new Error(`User with id ${message.userId} not found`);
                }
                return new Message({
                    ...message,
                    messenger: new User({
                        id: messenger.id,
                        username: messenger.username,
                        email: messenger.email,
                        password: messenger.password,
                        role: messenger.role as Role
                    })
                });
            }),
        });
    }
}
