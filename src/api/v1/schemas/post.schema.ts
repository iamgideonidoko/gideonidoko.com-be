import ajvInstance from './ajvInstance';
import { JSONSchemaType } from 'ajv';
import { NewPost } from '../interfaces/post.interface';

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

// export a validate function
export const newPostAjvValidate = ajvInstance.compile(newPostSchema);
