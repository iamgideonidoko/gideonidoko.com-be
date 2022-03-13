import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { transporter, mailOptions } from '../../../config/mailer.config';
import { createSuccess } from '../helpers/http.helper';

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { subject, text, html } = req.body;

    if (!subject || !text || !html) return next(createError('All fields are required'));

    try {
        await transporter.sendMail(mailOptions(subject, text, html));
        return createSuccess(res, 200, 'Email sent successfully', { mesage: 'sent' });
    } catch (err) {
        return next(err);
    }
};
