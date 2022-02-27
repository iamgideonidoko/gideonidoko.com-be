import { updatePostInDb, updatePostCommentsInDb } from './../services/post.service';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { createSuccess } from '../helpers/http.helper';
import Post from '../models/post.model';
import {
    fetchPostBySlug,
    fetchAuthorPostsByUsername,
    checkIfPostExists,
    getPostAuthor,
    savePostToDb,
    removePostFromDb,
} from '../services/post.service';
import { strToSlug } from '../helpers/post.helper';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().sort({ created_at: -1 }); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

// to get single post
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    if (!slug) return next(createError(400, 'No slug provided'));
    try {
        const post = await fetchPostBySlug(slug);
        return createSuccess(res, 200, 'Post fetched successfully', { post });
    } catch (err) {
        return next(err);
    }
};

export const getAuthorPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { author_username } = req.params;
    if (!author_username) return next(createError(400, 'No username provided'));
    try {
        const posts = await fetchAuthorPostsByUsername(author_username);
        return createSuccess(res, 200, 'Posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

// to create a new post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const {
        title,
        slug,
        cover_img,
        author_username,
        body,
        tags,
        is_published,
        is_pinned,
        is_comment_disabled,
        keywords,
        description,
    } = req.body;

    if (!title || !cover_img || !author_username || !body) {
        return next(createError(400, "The 'title', 'cover_img', 'author_username' and 'body' are required."));
    }
    try {
        const postExists = await checkIfPostExists(title);
        if (postExists)
            return next(
                createError(
                    400,
                    ...[
                        {
                            message: 'Blog post with the same title already exists and titles must be unique.',
                            errorType: 'TITLE_ALREADY_EXISTS',
                        },
                    ],
                ),
            );
        const author = await getPostAuthor(author_username);
        const newPost = {
            title,
            slug: slug ? slug : strToSlug(title),
            cover_img,
            author_username: author.username,
            author_name: author.name,
            body,
            tags: tags ? tags : [],
            is_published: is_published ? true : false,
            is_pinned: is_pinned ? true : false,
            is_comment_disabled: is_comment_disabled ? true : false,
            keywords: keywords ? keywords : [],
            description: description ? description : '',
        };
        const savedPost = await savePostToDb(newPost);
        return createSuccess(res, 200, 'User registered successfully', { post: savedPost });
    } catch (err) {
        return next(err);
    }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(createError(400, 'No `id` provided'));
    try {
        await removePostFromDb(id);
        return createSuccess(res, 200, 'Post deleted successfully', { deleted: true });
    } catch (err) {
        return next(err);
    }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(createError(400, 'No `id` provided'));
    try {
        const updatedPost = await updatePostInDb(id, req.body);
        return createSuccess(res, 200, 'Post updated successfully', { post: updatedPost });
    } catch (err) {
        return next(err);
    }
};

export const updatePostComments = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { comments, commentsUpdateAccessKey } = req.body;

    if (commentsUpdateAccessKey !== config.commentsUpdateAccessKey) return next(new createError.Unauthorized());

    try {
        const updatedPost = await updatePostCommentsInDb(id, comments);
        return createSuccess(res, 200, 'Post updated successfully', { post: updatedPost });
    } catch (err) {
        return next(err);
    }
};
