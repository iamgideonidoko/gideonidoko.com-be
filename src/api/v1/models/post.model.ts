import { Schema, model, PaginateModel } from 'mongoose';
import { IPost } from '../interfaces/post.interface';
import paginate from 'mongoose-paginate-v2';

// Define Blog Post Schema
const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        //the slug will be a unique identifier
        type: String,
        required: true,
        unique: true,
    },
    cover_img: String,
    author_username: {
        type: String,
        required: true,
    },
    author_name: String,
    read_time: string,
    body: {
        type: String,
        required: true,
    },
    tags: Array,
    is_published: {
        type: Boolean,
        default: false,
    },
    is_pinned: {
        type: Boolean,
        default: false,
    },
    is_comment_disabled: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
    comments: [
        {
            commentID: { type: Schema.Types.ObjectId },
            comment_author: String,
            comment_body: String,
            isAdmin: {
                type: Boolean,
                default: false,
            },
            isPostAuthor: {
                type: Boolean,
                default: false,
            },
            date: {
                type: Date,
                default: Date.now,
            },
            replies: [
                {
                    replyID: { type: Schema.Types.ObjectId },
                    reply_author: String,
                    reply_body: String,
                    isAdmin: {
                        type: Boolean,
                        default: false,
                    },
                    isPostAuthor: {
                        type: Boolean,
                        default: false,
                    },
                    date: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
    ],
    claps: {
        type: Number,
        default: 0,
    },
    keywords: [String],
    description: String,
});

PostSchema.plugin(paginate);

//create Post model
const Post = model<IPost, PaginateModel<IPost>>('blogpost', PostSchema);

//export the model
export default Post;
