import { saveAssetToDb } from './../services/asset.service';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { createSuccess } from '../helpers/http.helper';
import {
    checkIfAssetExists,
    removeAssetFromDb,
    fetchPaginatedAssets,
    fetchSearchedAssets,
} from '../services/asset.service';

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
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;
    try {
        const assets = await fetchPaginatedAssets(page, perPage);
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

export const getSearchedAssets = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query?.q?.toString();
    if (!query) return next(new createError.NotFound('No query found.'));
    if (query.length < 2) return next(new createError.BadRequest('Query should be at least 2 characters long'));

    try {
        const posts = await fetchSearchedAssets(query); // get all posts sorted by creation time
        return createSuccess(res, 200, 'Assets searched & fetched successfully', { posts });
    } catch (err) {
        return next(err);
    }
};
