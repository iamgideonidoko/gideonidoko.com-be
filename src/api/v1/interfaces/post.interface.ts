import { ObjectId, Document } from 'mongoose';

type PostComment = {
    commentID: ObjectId;
    comment_author: string;
    comment_body: string;
    isAdmin: boolean;
    isPostAuthor: boolean;
    date: Date;
    replies: Array<{
        replyID: ObjectId;
        reply_author: string;
        reply_body: string;
        isAdmin: boolean;
        isPostAuthor: boolean;
        date: Date;
    }>;
};

export interface IPost extends Document {
    title: string;
    slug: string;
    cover_img: string;
    author_username: string;
    author_name: string;
    body: string;
    tags: Array<string>;
    is_published: boolean;
    is_pinned: boolean;
    is_comment_disabled: boolean;
    created_at: Date;
    updated_at: Date;
    comments: Array<PostComment>;
    claps: number;
    keywords: string[];
    description: string;
}

export interface NewPost {
    title: string;
    slug: string;
    cover_img: string;
    author_username: string;
    author_name?: string;
    body: string;
    tags?: string[];
    is_published: boolean;
    is_pinned: boolean;
    is_comment_disabled: boolean;
    keywords?: string[];
    description: string;
}

export type NewPostReply = {
    reply_author: string;
    reply_body: string;
    isAdmin?: boolean;
    isPostAuthor?: boolean;
};

export type NewPostComment = {
    comment_author: string;
    comment_body: string;
    isAdmin?: boolean;
    isPostAuthor?: boolean;
    replies?: Array<NewPostReply>;
};

export interface PostUpdate {
    title?: string;
    slug?: string;
    cover_img?: string;
    author_username?: string;
    author_name?: string;
    body?: string;
    tags?: string[];
    is_published?: boolean;
    is_pinned?: boolean;
    is_comment_disabled?: boolean;
    keywords?: string[];
    description?: string;
}
