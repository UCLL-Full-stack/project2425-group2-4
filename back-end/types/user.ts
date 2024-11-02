import { RecordId } from "surrealdb";

type user = {
    id: RecordId;
    username: string;
    email: string;
    role: string;
};

export { user };
