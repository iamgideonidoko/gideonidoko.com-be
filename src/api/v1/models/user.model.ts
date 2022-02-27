import { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

//define a new schema for User model
const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    githubusername: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

//create User model
const User: Model<IUser> = model('adminuser', UserSchema);

//export the model
export default User;
