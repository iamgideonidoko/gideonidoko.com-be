const express = require('express');
const config = require('../../config/keys');
const bcrypt = require('bcryptjs');

const cors = require('cors');

//get jsonwebtoken
const jwt = require('jsonwebtoken');

//get auth middleware
const auth = require('../../middleware/auth');


//get express router for handling routes access
const router = express.Router();

//get the AdminUser Model
const AdminUser = require('../../models/AdminUser');


/*
@route POST api/auth
@description authenticate the admin user.
@access Public
*/
router.post('/', (req, res) => {
	
	const { username, password } = req.body;

	//check if all input fields have value
	if(!username || !password) {
		return res.status(400).json({ message: 'Please, enter all fields.' });
	}

	//Check for existing user in that model through username
	AdminUser.findOne({ username })
		.then(adminuser => {
			if(!adminuser) {
				return res.status(404).json({ message: 'Admin user does not exist.'})
			} else {

				//validate password
				bcrypt.compare(password, adminuser.password)
					.then(isMatch => {
						if(!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

						const { id, name, username, email, githubusername, created_at } = adminuser;

						jwt.sign(
							{ id }, //signs the admin user id as payload
							config.jwtSecret, //jwt secret
							{ expiresIn: 21600 }, //token to expire in 5 or 6 hrs
							(err, token) => { //callback
								if (err) throw err;
								res.json({
									token,
									adminuser: {
										id,
										name,
										username,
										email,
										githubusername,
										created_at
									}
								})
							}
						)
					})

			}
		})

})


/*
@route GET api/auth/user
@description Get authenticated admin user data.
@access Private
*/
router.get('/user', auth, (req, res) => {
	AdminUser.findById(req.user.id) //user id is gotten from the authenticated token
	.select('-password') //removes the password from the selection
	.then(adminuser => res.json(adminuser));
})



//export router
module.exports = router;