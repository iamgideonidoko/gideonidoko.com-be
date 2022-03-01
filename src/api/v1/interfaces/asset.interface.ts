import { Document } from 'mongoose';

export interface IAsset extends Document {
    name: string;
    url: string;
    size: number;
    file_type: string;
    author_username: string;
    author_name: string;
    created_at: Date;
}

export interface NewAsset {
    name: string;
    url: string;
    size: number;
    file_type: string;
    author_username: string;
    author_name: string;
}
