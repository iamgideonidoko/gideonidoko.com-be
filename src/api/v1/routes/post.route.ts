import {
    getAuthorPosts,
    createPost,
    deletePost,
    updatePost,
    updatePostComments,
    getPostsComments,
    getSearchedPosts,
    getSearchedPublishedPosts,
} from './../controllers/post.controller';
import { Router } from 'express';
import validateDto from '../middlewares/validateDto.middleware';
import { getPosts, getPinnedPosts, getPost, getPostsByTag, getPostsStats } from '../controllers/post.controller';
import { newPostAjvValidate, updatePostAjvValidate } from '../schemas/post.schema';
import auth from '../middlewares/auth.middleware';
import noauth from '../middlewares/noauth.middelware';

const postRoute = Router();

/*
@route 			GET /api/v1/posts
@description 	Get all available blog posts
@access 		Public
*/
postRoute.get('/posts', noauth, getPosts);

/*
@route 			GET /api/v1/posts
@description 	Get all available blog posts that are pinned
@access 		Public
*/
postRoute.get('/posts/pinned', noauth, getPinnedPosts);

/*
@route 			GET /api/v1/posts/search?q=term
@description 	Search through blog posts
@access 		Public
*/
postRoute.get('/posts/search', noauth, getSearchedPosts);

/*
@route 			GET /api/v1/posts/search?q=term
@description 	Search through blog posts
@access 		Public
*/
postRoute.get('/posts/searches', noauth, getSearchedPublishedPosts);

/*
@route 			GET /api/v1/posts/comments
@description 	Get all available blog posts comments
@access 		Public
*/
postRoute.get('/posts/comments', noauth, getPostsComments);

/*
@route 			GET api/v1/post/:slug
@description 	Get a single blog post with given slug
@access 		Public
*/
postRoute.get('/post/:slug', noauth, getPost);

/*
@route 			GET api/v1/post/stats
@description 	Get post stats
@access 		Public
*/
postRoute.get('/posts/stats', noauth, getPostsStats);

/*
@route 			GET api/v1/posts/:tag
@description 	Get a blog posts with a certain tag
@access 		Public
*/
postRoute.get('/posts/:tag', noauth, getPostsByTag);

/*
@route 			GET api/post/:author_username
@description 	Get posts by an author
@access 		Public
*/
postRoute.get('/post/:author_username', noauth, getAuthorPosts);

/*
@route 			POST api/v1/post
@description 	Create a new blog post
@access 		Private (auth needed)
*/
postRoute.post('/post', [auth, validateDto(newPostAjvValidate)], createPost);

/*
@route 			DELETE api/v1/post/:id
@description 	Delete a single blog post with given id
@access 		Private (auth needed)
*/
postRoute.delete('/post/:id', auth, deletePost);

/*
@route 			PUT api/v1/post/:id
@description 	update a single blog post with given id
@access 		Private (auth needed)
*/
postRoute.put('/post/:id', [auth, validateDto(updatePostAjvValidate)], updatePost);

/*
@route 			PUT api/v1/post/:id/comments
@description 	update a single blog post (just the comments) with given id
@access 		Public (any one can comment)
*/
postRoute.put('/post/:id/comments', noauth, updatePostComments);

export default postRoute;
