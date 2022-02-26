const express = require('express');

//get express router
const router = express.Router();

//get the BlogPost model
const BlogPost = require('../../models/BlogPost');

//get the AdminUser model
const Adminuser = require('../../models/AdminUser');

//get slug creator from helper
const { strToSlug } = require('../../helper');

//get the auth middleware
const auth = require('../../middleware/auth');

//get config
const config = require('../../config/keys');

/*
@route 			GET api/blogposts
@description 	Get all available blog posts
@access 		Public
*/
router.get('/', (req, res) => {
	BlogPost.find()
			.sort({ created_at: -1 }) 
			.then(posts => res.json(posts))
			.catch(err => console.log(err));
});

/*
@route 			GET api/blogposts/:slug
@description 	Get a single blog post with given slug
@access 		Public
*/
router.get('/:slug', (req, res) => {
	const { slug } = req.params;

	BlogPost.findOne({ slug })
		.then(post => {
			if(!post) {
				return res.json({ message: `Blog post with the slug '${slug}' does not exist.` });
			}
			res.json(post);
		})
});


/*
@route 			GET api/blogposts/author/:author_username
@description 	Get a single blog post with given author_username
@access 		Public
*/
router.get('/author/:author_username', (req, res) => {
	const { author_username } = req.params;

	BlogPost.find({ author_username })
		.then(post => {
			if(!post) {
				return res.json({ message: `No blog posts from author '${author_username}' or the author is not an admin user.` });
			}
			res.json(post);
		});

});




/*
@route 			POST api/blogposts
@description 	Create a new blog post
@access 		Private (auth needed)
*/
router.post('/', auth, (req, res) => {

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
		description
	} = req.body;  //the request body should contain the destructured stuff


	//quick validation
	if( !title || !cover_img || !author_username || !body) {
		return res.status(400).json({ message: "The 'title', 'cover_img', 'author_username' and 'body' are required." });
	}


	BlogPost.findOne({ title })
		.then(post => {
			if(post) {
				return res.status(400).json({ 
					message: "Blog post with the same title already exists and titles must be unique.",
					errorType: "TITLE_ALREADY_EXISTS"
				 });
			} else {

				Adminuser.findOne({ username: author_username })
					.then(adminuser => {
						if(!adminuser) {
							return res.status(400).json({ message: "Author does not exist or is not an admin user."})
						}

						//create a new blog post from the model
						const newBlogPost = new BlogPost({
							title,
							slug: slug ? slug : strToSlug(title),
							cover_img,
							author_username: adminuser.username,
							author_name: adminuser.name,
							body,
							tags: tags ? tags : [],
							is_published: is_published ? true : false,
							is_pinned: is_pinned ? true : false,
							is_comment_disabled: is_comment_disabled ? true : false,
							keywords: keywords ? keywords : [],
							description: description ? description : ''
						});

						//add new user to the db
						newBlogPost.save()
							.then(newPost => res.json(newPost));
					})

			}
		});

});


/*
@route 			DELETE api/blogposts/:id
@description 	Delete a single blog post with given id
@access 		Private (auth needed)
*/
router.delete('/:id', auth, (req, res) => {
	const { id } = req.params;
	BlogPost.findById(id)
		.then(post => post.remove().then(() => res.json({success: true})))
		.catch(err => res.status(404).json({success: false}));
});



/*
@route 			PUT api/blogposts/:id
@description 	update a single blog post with given id
@access 		Private (auth needed)
*/
router.put('/:id', auth, (req, res) => {
	const { id } = req.params;
	BlogPost.findByIdAndUpdate(id, req.body, { new: true }, (err, data) => {
		if (err) {
			return res.status(404).json({success: false});
		}
		res.json(data);
	});
});



/*
@route 			PUT api/blogposts/commentsupdate/:id
@description 	update a single blog post (just the comments) with given id
@access 		Public (any one can comment)
*/
router.put('/commentsupdate/:id', (req, res) => {
	const { id } = req.params;
	const { comments, commentsUpdateAccessKey } = req.body;

	if (commentsUpdateAccessKey === config.commentsUpdateAccessKey) {
		BlogPost.findByIdAndUpdate(id, { comments }, { new: true }, (err, data) => {
			if (err) {
				return res.status(404).json({success: false});
			}
			res.json(data);
		});
	} else {
		return res.status(401).json({ message: 'Authorisation denied.'});

	}
});



module.exports = router;