import { Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    created_at: Date;
}

export interface NewContact {
    name: string;
    email: string;
    message: string;
}
