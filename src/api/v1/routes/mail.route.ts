import { Router } from 'express';
import noauth from '../middlewares/noauth.middelware';
import validateDto from '../middlewares/validateDto.middleware';
import { newMailAjvValidate } from '../schemas/mail.schema';
import { sendEmail } from '../controllers/mail.controller';

const mailRoute = Router();

/*
@route 			POST api/v1/mail
@description 	Send a mail
@access 		Public (no auth needed)
*/
mailRoute.post('/mail', [noauth, validateDto(newMailAjvValidate)], sendEmail);

export default mailRoute;
