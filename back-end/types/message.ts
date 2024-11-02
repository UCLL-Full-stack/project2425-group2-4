import { RecordId } from "surrealdb";
import { user } from "./user";

type message = {
    id?: RecordId;
    text?: string;
    messenger?: user;
    timestamp?: Date;
};

export { message }
