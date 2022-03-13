import { Router } from 'express';
import { getLoggedInUser, loginUser, refreshUserToken } from '../controllers/auth.controller';
import validateDto from '../middlewares/validateDto.middleware';
import { loginUserAjvValidate, refreshTokenAjvValidate } from '../schemas/auth.schema';
import auth from '../middlewares/auth.middleware';
import noauth from '../middlewares/noauth.middelware';

const authRoute = Router();

/*
@route           POST /api/v1/auth/login
@description     authenticate the admin user.
@access          Public
*/
authRoute.post('/auth/login', [noauth, validateDto(loginUserAjvValidate)], loginUser);

/*
@route 			POST /api/v1/auth/refresh (refresh token)
@description 	refresh user token
@access 		Public
*/
authRoute.post('/auth/refresh', [noauth, validateDto(refreshTokenAjvValidate)], refreshUserToken);

/*
@route GET api/v1/auth/user
@description Get authenticated admin user data.
@access Private
*/
authRoute.get('/auth/user', auth, getLoggedInUser);

export default authRoute;
