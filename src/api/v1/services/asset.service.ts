import { IAsset, NewAsset } from '../interfaces/asset.interface';
import Asset from '../models/asset.model';
import createError from 'http-errors';
import { PaginateOptions, PaginateResult } from 'mongoose';

export const fetchPaginatedAssets = (
    page: number,
    perPage: number,
): Promise<PaginateResult<IAsset & { _id: string }>> => {
    return new Promise<PaginateResult<IAsset & { _id: string }>>(async (resolve, reject) => {
        const paginationOptions: PaginateOptions = {
            sort: { created_at: -1 },
            page,
            limit: perPage,
            customLabels: {
                limit: 'perPage',
            },
        };

        try {
            const paginatedAssets = await Asset.paginate({}, paginationOptions);
            resolve(paginatedAssets);
        } catch (err) {
            reject(err);
        }
    });
};

export const saveAssetToDb = (asset: NewAsset): Promise<IAsset & { _id: string }> => {
    return new Promise<IAsset & { _id: string }>(async (resolve, reject) => {
        try {
            const newAsset = new Asset(asset);
            const savedAsset = newAsset.save();
            resolve(savedAsset);
        } catch (err) {
            reject(err);
        }
    });
};

export const checkIfAssetExists = (name: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const asset = await Asset.findOne({ name });
            if (asset) resolve(true);
            resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

export const removeAssetFromDb = (assetId: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const asset = await Asset.findById(assetId);
            if (asset) {
                await asset.remove();
                resolve(true);
            } else {
                reject(new createError.NotFound('Asset with id could not be found'));
            }
        } catch (err) {
            reject(err);
        }
    });
};

export const fetchSearchedAssets = (query: string): Promise<unknown> => {
    return new Promise<unknown>(async (resolve, reject) => {
        try {
            // strip special characters
            query = query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            const searchedAssets = await Asset.find({
                $or: [{ name: { $regex: query, $options: 'i' } }, { file_type: { $regex: query, $options: 'i' } }],
            })
                .sort({ created_at: -1 })
                .limit(10);
            resolve(searchedAssets);
        } catch (err) {
            reject(err);
        }
    });
};
