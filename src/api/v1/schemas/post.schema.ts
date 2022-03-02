import ajvInstance from './ajvInstance';
import { JSONSchemaType } from 'ajv';
import { NewPost, NewPostComment, NewPostReply } from '../interfaces/post.interface';

const newPostSchema: JSONSchemaType<NewPost> = {
    type: 'object',
    properties: {
        title: { type: 'string', nullable: false },
        slug: { type: 'string', nullable: true },
        cover_img: { type: 'string', nullable: false },
        author_username: { type: 'string', nullable: false },
        author_name: { type: 'string', nullable: true },
        body: { type: 'string', nullable: false },
        is_published: { type: 'boolean', nullable: true },
        is_pinned: { type: 'boolean', nullable: true },
        is_comment_disabled: { type: 'boolean', nullable: true },
        description: { type: 'string', nullable: true },
        keywords: { type: 'array', nullable: true, items: { type: 'string' } },
        tags: { type: 'array', nullable: true, items: { type: 'string' } },
    },
    required: ['title', 'author_username', 'cover_img', 'body'],
    additionalProperties: false,
};

const singlePostReplySchema: JSONSchemaType<NewPostReply> = {
    type: 'object',
    properties: {
        reply_author: { type: 'string', nullable: false },
        reply_body: { type: 'string', nullable: false },
        isAdmin: { type: 'boolean', nullable: true },
        isPostAuthor: { type: 'boolean', nullable: true },
    },
    required: ['reply_author', 'reply_body'],
    additionalProperties: true,
};

const singlePostCommentSchema: JSONSchemaType<NewPostComment> = {
    type: 'object',
    properties: {
        comment_author: { type: 'string', nullable: false },
        comment_body: { type: 'string', nullable: false },
        isAdmin: { type: 'boolean', nullable: true },
        isPostAuthor: { type: 'boolean', nullable: true },
        replies: { type: 'array', nullable: true, items: singlePostReplySchema },
    },
    required: ['comment_author', 'comment_body'],
    additionalProperties: true,
};

const newPostComments: JSONSchemaType<Array<NewPostComment>> = {
    type: 'array',
    nullable: true,
    items: singlePostCommentSchema,
};

// export a validate function
export const newPostAjvValidate = ajvInstance.compile(newPostSchema);

export const newPostCommentsAjvValidate = ajvInstance.compile(newPostComments);
