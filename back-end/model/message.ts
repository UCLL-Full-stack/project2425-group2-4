import { User } from "./user";
import {
    User as UserPrisma,
    Message as MessagePrisma,
    Chat as ChatPrisma
} from '@prisma/client';

export class Message {
    private id?: number;
    private text: string;
    private messenger: User;
    private timestamp: Date;

    constructor(message: {
        id?: number;
        text: string;
        messenger: User;
        timestamp: Date;
    }) {
        this.validate(message);
        this.id = message.id;
        this.text = message.text;
        this.messenger = message.messenger;
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

    getMessenger(): User {
        return this.messenger;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }

    equals(message: Message): boolean {
        return (
            this.text === message.getText() &&
            this.messenger === message.getMessenger() &&
            this.timestamp === message.getTimestamp()
        );
    }

    static from({
        id,
        text,
        timestamp,
        messenger, 
    }: MessagePrisma) {
        return new Message({
            id,
            text,
            timestamp,
            messenger: User.from(messenger),
        });
    }
}