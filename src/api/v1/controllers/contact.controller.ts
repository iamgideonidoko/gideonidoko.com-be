import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { createSuccess } from '../helpers/http.helper';
import { saveContactToDb, removeContactFromDb, fetchPaginatedContacts } from '../services/contact.service';
import constants from '../../../config/constants.config';

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
    const perPage = Number(req.query?.per_page) || 10;
    const page = Number(req.query?.page) || 1;
    try {
        // const contacts = await Contact.find().sort({ created_at: -1 });
        const contacts = await fetchPaginatedContacts(page, perPage);
        return createSuccess(res, 200, 'Contacts fetched successfully', { contacts });
    } catch (err) {
        return next(err);
    }
};

export const addContact = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, message, contactPostAccessKey } = req.body;
    if (!name || !email || !message) return next(createError(400, 'The name, email & message fields are required'));
    if (contactPostAccessKey !== constants.contactPostAccessKey) return next(new createError.Unauthorized());
    try {
        const savedContact = await saveContactToDb({ name, email, message });
        return createSuccess(res, 200, 'Contacts fetched successfully', { contact: savedContact });
    } catch (err) {
        return next(err);
    }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(createError(400, 'No `id` provided'));
    try {
        await removeContactFromDb(id);
        return createSuccess(res, 200, 'Contact deleted successfully', { deleted: true });
    } catch (err) {
        return next(err);
    }
};
