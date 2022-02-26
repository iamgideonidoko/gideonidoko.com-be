require('dotenv').config();

module.exports = {
	mongodbURI: process.env.MONGODB_URI,
	jwtSecret: process.env.JWT_SECRET,
	commentsUpdateAccessKey: process.env.COMMENTS_UPDATE_ACCESS_KEY,
	contactPostAccessKey: process.env.CONTACT_POST_ACCESS_KEY
}