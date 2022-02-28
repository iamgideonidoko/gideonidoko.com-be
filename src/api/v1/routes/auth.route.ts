import { Router } from 'express';
import { getLoggedInUser, loginUser, logoutUser, refreshUserToken } from '../controllers/auth.controller';
import validateDto from '../middlewares/validateDto.middleware';
import { loginUserAjvValidate, refreshTokenAjvValidate } from '../schemas/auth.schema';
import auth from '../middlewares/auth.middleware';

const authRoute = Router();

/*
@route           POST /api/v1/auth/login
@description     authenticate the admin user.
@access          Public
*/
authRoute.post('/auth/login', validateDto(loginUserAjvValidate), loginUser);

/*
@route 			POST /api/v1/auth/login (logout user)
@description 	logout user
@access 		Public
*/
authRoute.post('/auth/logout', validateDto(refreshTokenAjvValidate), logoutUser);

/*
@route 			POST /api/v1/auth/refresh (refresh token)
@description 	refresh user token
@access 		Public
*/
authRoute.post('/auth/refresh', validateDto(refreshTokenAjvValidate), refreshUserToken);

/*
@route GET api/v1/auth/user
@description Get authenticated admin user data.
@access Private
*/
authRoute.get('/auth/user', auth, getLoggedInUser);

export default authRoute;
