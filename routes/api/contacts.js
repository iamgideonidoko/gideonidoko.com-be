const express = require('express');

//get express router
const router = express.Router();

//get the Contact model
const Contact = require('../../models/Contact');

//get the auth middleware
const auth = require('../../middleware/auth');

//get config
const config = require('../../config/keys');

/*
@route 			GET api/contacts
@description 	Get all available contacts
@access 		Public
*/
router.get('/', (req, res) => {
	Contact.find()
			.sort({ created_at: -1 }) 
			.then(posts => res.json(posts))
			.catch(err => console.log(err));
});


/*
@route 			POST api/contacts
@description 	Add a new contact info
@access 		Private (auth needed)
*/
router.post('/', (req, res) => {

	const { 
		name,
		email, 
		message,
		contactPostAccessKey
	} = req.body;  //the request body should contain the destructured stuff


	//quick validation
	if( !name || !email || !message) {
		return res.status(400).json({ message: "The 'name', 'email' and 'message' are required." });
	}

	if (contactPostAccessKey === config.contactPostAccessKey) {
		//create a new contact from the model
		const newContact = new Contact({
			name,
			email,
			message
		});

		//add new user to the db
		newContact.save()
			.then(newPost => res.json(newPost));
		
	} else {
		return res.status(401).json({ message: 'Authorisation denied.'});

	}

});


/*
@route 			DELETE api/contacts/:id
@description 	Delete a single contact info
@access 		Private (auth needed)
*/
router.delete('/:id', auth, (req, res) => {
	const { id } = req.params;
	Contact.findById(id)
		.then(post => post.remove().then(() => res.json({success: true})))
		.catch(err => res.status(404).json({success: false}));
});


module.exports = router;