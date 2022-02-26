const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Blog Post Schema
const AssetSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	url: {
		type: String,
		required: true
	},
	size: { //the slug will be a unique identifier
		type: Number
	},
	file_type: {
		type: String
	},
	author_username: {
		type: String,
		required: true
	},
	author_name: String,
	created_at: {
		type: Date,
		default: Date.now
	}
	
});

//create Asset model
const Asset = mongoose.model('asset', AssetSchema);


//export the model
module.exports = Asset;