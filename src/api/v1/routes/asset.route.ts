import { addAsset, deleteAsset, getAssets } from './../controllers/asset.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const assetRoute = Router();

/*
@route POST /api/v1/asset
@description Add a new asset.
@access Private
*/
assetRoute.post('/asset', auth, addAsset);

/*
@route GET /api/v1/assets
@description Get all assets.
@access Public
*/
assetRoute.get('/assets', getAssets);

// @route  DELETE /api/v1/asset/:id
// @description   Delete an asset from the db
// @access Private
assetRoute.delete('/asset/:id', auth, deleteAsset);

export default assetRoute;
