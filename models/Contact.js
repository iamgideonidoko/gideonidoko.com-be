const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Contact Schema
const ContactSchema = new Schema({
	name: { //name of contact
		type: String,
		required: true
	},
	email: { //email of contact
		type: String,
		required: true
	},
	message: { //message from the contact
		type: String,
		required: true,
	},
	created_at: { //time created
		type: Date,
		default: Date.now
	}
});

//create BlogPost model
const Contact = mongoose.model('contact', ContactSchema);


//export the model
module.exports = Contact;