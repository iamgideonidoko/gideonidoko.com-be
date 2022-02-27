import {
    getAuthorPosts,
    createPost,
    deletePost,
    updatePost,
    updatePostComments,
} from './../controllers/post.controller';
import { Router } from 'express';
import validateDto from '../middlewares/validateDto.middleware';
import { getPosts, getPost } from '../controllers/post.controller';
import { newPostAjvValidate } from '../schemas/post.schema';
import auth from '../middlewares/auth.middleware';

const postRoute = Router();

/*
@route 			GET /api/v1/posts
@description 	Get all available blog posts
@access 		Public
*/
postRoute.get('/posts', getPosts);

/*
@route 			GET api/v1/post/:slug
@description 	Get a single blog post with given slug
@access 		Public
*/
postRoute.get('/post/:slug', getPost);

/*
@route 			GET api/post/:author_username
@description 	Get posts by an author
@access 		Public
*/
postRoute.get('/post/:author_username', getAuthorPosts);

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
router.delete('/post/:id', auth, deletePost);

/*
@route 			PUT api/v1/post/:id
@description 	update a single blog post with given id
@access 		Private (auth needed)
*/
router.put('/post/:id', auth, updatePost);

/*
@route 			PUT api/v1/post/:id/comments
@description 	update a single blog post (just the comments) with given id
@access 		Public (any one can comment)
*/
router.put('/post/:id/comments', updatePostComments);

export default postRoute;
