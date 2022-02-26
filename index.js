require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //for cross origin
const rateLimit = require("express-rate-limit"); //for limiting request per hour

//ROUTES
const adminusersRoute = require('./routes/api/adminusers');
const blogpostsRoute = require('./routes/api/blogposts');
const contactsRoute = require('./routes/api/contacts');
const assetsRoute = require('./routes/api/assets');
const authRoute = require('./routes/api/auth');

//db connection uri
const db = require('./config/keys').mongodbURI;


//initialise express
const app = express();


//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var allowlist = ['https://gideonidoko.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: true } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


//cors middleware
app.options('*', cors()); //enable preflight request for DELETE request
app.use(cors(corsOptionsDelegate));


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute window
	max: 100, // limit each IP to 100 requests per windowMs (100request per minute)
	message: 'You have exceeded the 100 requests in 1 min limit!', 
	headers: true,
  });
  
  //  apply to all requests
  app.use(limiter);


//connect to mongodb via mongoose
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, })
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(`MONGODB CONNECTION ERROR: ${err}`));


//use ROUTES
app.use('/api/adminusers', adminusersRoute);
app.use('/api/blogposts', blogpostsRoute);
app.use('/api/contacts', contactsRoute);
app.use('/api/assets', assetsRoute);
app.use('/api/auth', authRoute);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Backend server started on port ${port}`)
});


/* http://gideonidokowebsitebckendapihst.herokuapp.com/ */
