const mongoose = require('mongoose');
const { Schema } = mongoose;

//define a new schema for AdminUser model
const AdminUserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	githubusername: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
})

//create AdminUser model
const AdminUser = mongoose.model('adminuser', AdminUserSchema);


//export the model
module.exports = AdminUser;