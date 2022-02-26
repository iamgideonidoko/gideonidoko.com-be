const express = require('express');
const config = require('../../config/keys');
const bcrypt = require('bcryptjs');
//get jsonwebtoken
const jwt = require('jsonwebtoken');

//get express router for handling routes access
const router = express.Router();

//get the AdminUser Model
const AdminUser = require('../../models/AdminUser');


/*
@route POST api/adminusers
@description Register a new admin user.
@access Public
*/
router.post('/', (req, res) => {
	
	const { name, username, email, password, githubusername } = req.body;

	//check if all input fields have value
	if(!name || !username || !email || !password || !githubusername) {
		return res.status(400).json({ message: 'Please, enter all fields.' });
	}

	//Check for existing user in that model through email
	AdminUser.findOne({ email })
		.then(adminuser => {
			if(adminuser) {
				return res.status(404).json({ message: 'Admin user already exists.'})
			} else {
				//create new admin user from the model
				const newAdminUser = new AdminUser({
					name,
					username,
					email,
					password,
					githubusername
				});

				//hash password using bcrypt
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newAdminUser.password, salt, (err, hash) => {
						if(err) throw err;
						newAdminUser.password = hash;
						
						//add new user to the db
						newAdminUser.save()
							.then(adminuser => {
								const { id, name, username, email, githubusername, created_at } = adminuser;

								jwt.sign(
									{ id }, //signs the admin user id as payload
									config.jwtSecret, //jwt secret
									{ expiresIn: 21600 }, //token to expire in 5 or 6hrs
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

							});
					})
				})

			}
		})


})



//export router
module.exports = router;