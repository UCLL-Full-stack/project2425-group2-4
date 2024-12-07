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
    //private userId: number;
    private timestamp: Date;

    constructor(message: {
        id?: number;
        text: string;
        //userId: number;
        messenger: User;
        timestamp: Date;
    }) {
        this.validate(message);
        this.id = message.id;
        this.text = message.text;
        //this.userId = message.userId;
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

    // getUserId(): number {
    //     return this.userId;
    // }

    getTimestamp(): Date {
        return this.timestamp;
    }

    getMessenger(): User {
        return this.messenger;
    }

    equals(message: Message): boolean {
        return (
            this.text === message.getText() &&
            // this.userId === message.getUserId() &&
            this.timestamp === message.getTimestamp() &&
            this.messenger === message.getMessenger()
        );
    }

    static async from({
        id,
        text,
        timestamp,
        messenger,
        // userId,
    }: MessagePrisma & { messenger: UserPrisma }): Promise<Message>{
        return new Message({
            id,
            text,
            // userId,
            messenger: User.from(messenger),
            timestamp,
        });
    }
}