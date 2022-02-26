const config = require('../config/keys');
const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {

	const token = req.header('x-auth-token');

	// check for token
	if (!token) return res.status(401).json( { message: 'No token, authorisation denied.'} );

	try {
		//if there is a token, then verify
		const decoded = jwt.verify(token, config.jwtSecret);

		//add the admin user from payload
		req.user = decoded;

		next();
	} catch(e) {
		res.status(400).json({ message: 'Token is not valid.' });
	}


}

module.exports = auth;