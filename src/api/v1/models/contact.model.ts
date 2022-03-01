import { Schema, model, PaginateModel } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';
import paginate from 'mongoose-paginate-v2';

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

ContactSchema.plugin(paginate);

//create Contact model
const Contact = model<IContact, PaginateModel<IContact>>('contact', ContactSchema);

//export the model
export default Contact;
