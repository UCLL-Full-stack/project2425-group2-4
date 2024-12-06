import { User } from "./user";
import {
    User as UserPrisma,
    Message as MessagePrisma,
    Chat as ChatPrisma
} from '@prisma/client';

export class Message {
    private id?: number;
    private text: string;
    private userId: number;
    private timestamp: Date;

    constructor(message: {
        id?: number;
        text: string;
        userId: number;
        timestamp: Date;
    }) {
        this.validate(message);
        this.id = message.id;
        this.text = message.text;
        this.userId = message.userId;
        this.timestamp = message.timestamp;
    }

    validate(chat: { text: string; timestamp: Date }) {
        if (!chat.text) {
            throw new Error("Can't send empty messages");
        }
        if (!chat.timestamp) {
            throw new Error('Date is incorrect');
        }
    }  

    getId(): number | undefined {
        return this.id;
    }

    getText(): string {
        return this.text;
    }

    getUserId(): number {
        return this.userId;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }

    equals(message: Message): boolean {
        return (
            this.text === message.getText() &&
            this.userId === message.getUserId() &&
            this.timestamp === message.getTimestamp()
        );
    }

    static async from({
        id,
        text,
        timestamp,
        userId,
    }: MessagePrisma): Promise<Message> {
        return new Message({
            id,
            text,
            userId,
            timestamp,
        });
    }
}