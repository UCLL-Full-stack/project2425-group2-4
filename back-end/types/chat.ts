import { RecordId } from 'surrealdb';
import { message } from './message';
import { user } from './user';

type chat = {
    id?: RecordId;
    name?: string;
    created_at?: Date;
    messages?: Array<message>;
    users?: Array<user>;
};

export { chat };
