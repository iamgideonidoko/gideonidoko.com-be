import { updatePostInDb, updatePostCommentsInDb } from './../services/post.service';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { createSuccess } from '../helpers/http.helper';
import {
    fetchPostBySlug,
    fetchAuthorPostsByUsername,
    checkIfPostExists,
    getPostAuthor,
    savePostToDb,
    removePostFromDb,
    fetchPaginatedPosts,
    fetchPaginatedPostsComments,
    fetchSearchedPosts,
    fetchPaginatedPostsByTag,
} from '../services/post.service';
import { strToSlug } from '../helpers/post.helper';
import constants from '../../../config/constants.config';
import { newPostCommentsAjvValidate } from '../schemas/post.schema';
import Post from '../models/post.model';
import { getReadTime } from '../helpers/post.helper';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;

    try {
        // const posts = await Post.find().sort({ created_at: -1 }); // get all posts sorted by creation time
        const posts = await fetchPaginatedPosts(page, perPage); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

export const getPinnedPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({ is_pinned: true }).sort({ created_at: -1 }); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Pinned posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

export const getPostsComments = async (req: Request, res: Response, next: NextFunction) => {
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;
    // return res.json({ status: 'ok' });
    try {
        // const posts = await Post.find().sort({ created_at: -1 }); // get all posts sorted by creation time
        const posts = await fetchPaginatedPostsComments(page, perPage); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

export const getSearchedPosts = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query?.q?.toString();
    if (!query) return next(new createError.NotFound('No query found.'));
    if (query.length < 2) return next(new createError.BadRequest('Query should be at least 2 characters long'));

    try {
        // const posts = await Post.find().sort({ created_at: -1 }); // get all posts sorted by creation time
        const posts = await fetchSearchedPosts(query); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Posts searched & fetched successfully', { posts });
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

// Get posts that belong to a given tag
export const getPostsByTag = async (req: Request, res: Response, next: NextFunction) => {
    const { tag } = req.params;
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;
    if (!tag) return next(createError(400, 'No tag provided'));
    try {
        const posts = await fetchPaginatedPostsByTag(tag, page, perPage);
        return createSuccess(res, 200, 'Posts fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};

export const getAuthorPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { author_username } = req.params;
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;
    if (!author_username) return next(createError(400, 'No username provided'));
    try {
        const posts = await fetchAuthorPostsByUsername(author_username, page, perPage);
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
            read_time: getReadTime(body),
            body,
            tags: tags ? tags : [],
            is_published: is_published ? true : false,
            is_pinned: is_pinned ? true : false,
            is_comment_disabled: is_comment_disabled ? true : false,
            keywords: keywords ? keywords : [],
            description: description ? description : '',
        };
        const savedPost = await savePostToDb(newPost);
        return createSuccess(res, 200, 'Post created successfully', { post: savedPost });
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
    const newTitle = req.query?.new_title?.toString();
    if (!id) return next(createError(400, 'No `id` provided'));
    let newUpdate = req.body;
    const { body, title } = req.body;
    if (body) {
        newUpdate = { ...req.body, read_time: getReadTime(body) };
    }
    try {
        if (title && newTitle === 'true') {
            const postExists = await checkIfPostExists(title);
            if (postExists)
                return next(
                    createError(
                        400,
                        ...[
                            {
                                message:
                                    'A different blog post with the same title already exists and titles must be unique.',
                                errorType: 'TITLE_ALREADY_EXISTS',
                            },
                        ],
                    ),
                );
        }
        const updatedPost = await updatePostInDb(id, newUpdate);
        return createSuccess(res, 200, 'Post updated successfully', { post: updatedPost });
    } catch (err) {
        return next(err);
    }
};

export const updatePostComments = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { comments, commentsUpdateAccessKey } = req.body;

    if (commentsUpdateAccessKey !== constants.commentsUpdateAccessKey) return next(new createError.Unauthorized());
    if (!Array.isArray(comments)) return next(createError(400, 'Comments must be an array of comments'));
    const valid = newPostCommentsAjvValidate(comments);
    if (!valid) return next(createError(400, ...[{ validation_error: newPostCommentsAjvValidate.errors }]));

    try {
        const updatedPost = await updatePostCommentsInDb(id, comments);
        return createSuccess(res, 200, 'Post updated successfully', { post: updatedPost });
    } catch (err) {
        return next(err);
    }
};
