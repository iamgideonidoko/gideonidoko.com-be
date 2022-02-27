import { Schema, model, Model } from 'mongoose';
import { IAsset } from '../interfaces/asset.interface';

// Define Blog Post Schema
const AssetSchema = new Schema<IAsset>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
    },
    size: {
        //the slug will be a unique identifier
        type: Number,
    },
    file_type: {
        type: String,
    },
    author_username: {
        type: String,
        required: true,
    },
    author_name: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
});

//create Asset model
const Asset: Model<IAsset> = model('asset', AssetSchema);

//export the model
export default Asset;
