import { getContacts, addContact, deleteContact } from './../controllers/contact.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const contactRoute = Router();

/*
@route 			GET api/v1/contacts
@description 	Get all available contacts
@access 		Public
*/
contactRoute.get('/contacts', getContacts);

/*
@route 			POST api/v1/contact
@description 	Add a new contact info
@access 		Private (auth needed)
*/
contactRoute.post('/contact', addContact);

/*
@route 			DELETE api/v1/contact/:id
@description 	Delete a single contact info
@access 		Private (auth needed)
*/
contactRoute.delete('/contact/:id', auth, deleteContact);

export default contactRoute;
