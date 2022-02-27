import { Schema, model, Model } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';

// Define Contact Schema
const ContactSchema = new Schema<IContact>({
    name: {
        //name of contact
        type: String,
        required: true,
    },
    email: {
        //email of contact
        type: String,
        required: true,
    },
    message: {
        //message from the contact
        type: String,
        required: true,
    },
    created_at: {
        //time created
        type: Date,
        default: Date.now,
    },
});

//create Contact model
const Contact: Model<IContact> = model('contact', ContactSchema);

//export the model
export default Contact;
