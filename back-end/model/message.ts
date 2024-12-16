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

    validate(chat: { text: string; timestamp: Date; messenger: User }) {
        if (!chat.text) {
            throw new Error("Can't send empty messages");
        }
        if (!chat.timestamp) {
            throw new Error('Date is incorrect');
        }
        if (!chat.messenger) {
            throw new Error('User doesn\'t exist');
        }
    }  

    getId(): number | undefined {
        return this.id;
    }

    getText(): string {
        return this.text;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }

    getMessenger(): User {
        return this.messenger;
    }

    equals(message: Message): boolean {
        return (
            this.text === message.getText() &&
            this.timestamp === message.getTimestamp() &&
            this.messenger === message.getMessenger()
        );
    }

    static async from({
        id,
        text,
        timestamp,
        messenger,
    }: MessagePrisma & { messenger: UserPrisma }): Promise<Message>{
        return new Message({
            id,
            text,
            messenger: User.from(messenger),
            timestamp,
        });
    }
}