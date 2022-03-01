import createError from 'http-errors';
import Post from '../models/post.model';
import { IPost, NewPost } from '../interfaces/post.interface';
import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { PaginateOptions, PaginateResult } from 'mongoose';

export const fetchPaginatedPosts = (
    page: number,
    perPage: number,
): Promise<PaginateResult<IPost & { _id: string }>> => {
    return new Promise<PaginateResult<IPost & { _id: string }>>(async (resolve, reject) => {
        const paginationOptions: PaginateOptions = {
            select: '-body -comments',
            page,
            limit: perPage,
            customLabels: {
                limit: 'perPage',
            },
        };

        try {
            const paginatedPosts = await Post.paginate({}, paginationOptions);
            resolve(paginatedPosts);
        } catch (err) {
            reject(err);
        }
    });
};

export const fetchPaginatedPostsComments = (
    page: number,
    perPage: number,
): Promise<PaginateResult<IPost & { _id: string }>> => {
    return new Promise<PaginateResult<IPost & { _id: string }>>(async (resolve, reject) => {
        const paginationOptions: PaginateOptions = {
            select: '_id title slug comments',
            page,
            limit: perPage,
            customLabels: {
                limit: 'perPage',
            },
        };

        try {
            const paginatedPosts = await Post.paginate({}, paginationOptions);
            resolve(paginatedPosts);
        } catch (err) {
            reject(err);
        }
    });
};

export const fetchPostBySlug = (slug: string): Promise<IPost & { _id: string }> => {
    return new Promise<IPost & { _id: string }>(async (resolve, reject) => {
        try {
            const post = await Post.findOne({ slug });
            if (!post) reject(new createError.NotFound(`Post does not exist.`));
            resolve(post as IPost & { _id: string });
        } catch (err) {
            reject(err);
        }
    });
};

export const fetchAuthorPostsByUsername = (
    author_username: string,
    page: number,
    perPage: number,
): Promise<PaginateResult<IPost & { _id: string }>> => {
    return new Promise<PaginateResult<IPost & { _id: string }>>(async (resolve, reject) => {
        const paginationOptions: PaginateOptions = {
            select: '-body -comments',
            page,
            limit: perPage,
            customLabels: {
                limit: 'perPage',
            },
        };
        try {
            //Check for existing user in that model through password
            const posts = await Post.paginate({ author_username }, paginationOptions);
            if (!posts) reject(new createError.NotFound(''));
            resolve(posts);
        } catch (err) {
            reject(err);
        }
    });
};

export const checkIfPostExists = (title: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const post = await Post.findOne({ title });
            if (post) resolve(true);
            resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

export const getPostAuthor = (username: string): Promise<IUser & { _id: string }> => {
    return new Promise<IUser & { _id: string }>(async (resolve, reject) => {
        try {
            const author = await User.findOne({ username });
            if (!author) reject(createError(400, 'Author does not exist or is not an admin user.'));
            resolve(author as IUser & { _id: string });
        } catch (err) {
            reject(err);
        }
    });
};

export const savePostToDb = (post: NewPost): Promise<IPost & { _id: string }> => {
    return new Promise<IPost & { _id: string }>(async (resolve, reject) => {
        try {
            const newPost = new Post(post);
            const savedPost = await newPost.save();
            resolve(savedPost);
        } catch (err) {
            reject(err);
        }
    });
};

export const removePostFromDb = (postId: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const post = await Post.findById(postId);
            if (post) {
                await post.remove();
                resolve(true);
            } else {
                reject(new createError.NotFound('Post with id could not be found'));
            }
        } catch (err) {
            reject(err);
        }
    });
};

export const updatePostInDb = (id: string, newUpdate: object): Promise<IPost & { _id: string }> => {
    return new Promise<IPost & { _id: string }>(async (resolve, reject) => {
        try {
            const post = await Post.findByIdAndUpdate(id, newUpdate, { new: true });
            resolve(post as IPost & { _id: string });
        } catch (err) {
            reject(err);
        }
    });
};

export const updatePostCommentsInDb = (id: string, comments: object): Promise<IPost & { _id: string }> => {
    return new Promise<IPost & { _id: string }>(async (resolve, reject) => {
        try {
            const post = await Post.findByIdAndUpdate(id, { comments }, { new: true });
            resolve(post as IPost & { _id: string });
        } catch (err) {
            reject(err);
        }
    });
};
