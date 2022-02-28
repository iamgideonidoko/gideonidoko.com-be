import { saveAssetToDb } from './../services/asset.service';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { createSuccess } from '../helpers/http.helper';
import { checkIfAssetExists, removeAssetFromDb } from '../services/asset.service';
import Asset from '../models/asset.model';

export const addAsset = async (req: Request, res: Response, next: NextFunction) => {
    const { name, url, size, file_type, author_username, author_name } = req.body;

    //check if required fields have value
    if (!name || !url) return next(createError(400, 'No value for `name` and `url`.'));

    try {
        const assetExists = await checkIfAssetExists(name);
        if (assetExists) return next(createError(400, 'Asset with the same name already exists.'));

        const savedAsset = await saveAssetToDb({ name, url, size, file_type, author_username, author_name });
        return createSuccess(res, 200, 'Asset saved successfully', { asset: savedAsset });
    } catch (err) {
        return next(err);
    }
};

export const getAssets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assets = await Asset.find().sort({ created_at: -1 });
        return createSuccess(res, 200, 'Assets fetched successfully', { assets });
    } catch (err) {
        return next(err);
    }
};

export const deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(createError(400, 'No `id` provided'));
    try {
        await removeAssetFromDb(id);
        return createSuccess(res, 200, 'Asset deleted successfully', { deleted: true });
    } catch (err) {
        return next(err);
    }
};
