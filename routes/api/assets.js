const express = require('express');

//get express router for handling routes access
const router = express.Router();

//get the Asset Model
const Asset = require('../../models/Asset');

//get the auth middleware
const auth = require('../../middleware/auth');


/*
@route POST api/assets
@description Add a new asset.
@access Private
*/
router.post('/', auth, (req, res) => {
	
	const { name, url, size, file_type, author_username, author_name } = req.body;

	//check if required fields have value
	if(!name || !url) {
		return res.status(400).json({ message: 'No value for `name` and `url`.' });
	}

	//Check for existing user in that model through email
	Asset.findOne({ name })
		.then(adminuser => {
			if(adminuser) {
				return res.status(404).json({ message: 'Asset with the same name already exists.'})
			} else {
				//create new admin user from the model
				const newAsset = new Asset({
					name,
					url,
					size,
					file_type,
					author_username,
					author_name
				});

				newAsset.save()
					.then(asset => {
						const { id, name, url, size, file_type, author_username, author_name, created_at } = asset;

						res.json({
							asset: {
								id,
								name,
								url,
								size,
								file_type,
								author_username,
								author_name,
								created_at
							}
						})
					});
			}
		})


})



/*
@route GET api/assets
@description Get all assets.
@access Public
*/
router.get('/', (req, res) => {
	Asset.find() //get all the assets in the db
		.sort({ created_at: -1 })
		.then(assets => res.json(assets))
		.catch(err => console.log(err));
})




// @route  DELETE api/assets/:id
// @description   Delete an asset from the db
// @access Private
router.delete('/:id', auth, (req, res) => {
	//find the asset by the given name
	Asset.findById(req.params.id)
		.then(asset => asset.remove().then(() => res.json({success: true})))
		.catch(err => res.status(404).json({success: false}));
});


//export router
module.exports = router;