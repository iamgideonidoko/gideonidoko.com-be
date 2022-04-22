import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { mailOptions, sendgridMail } from '../../../config/mailer.config';
import { createSuccess } from '../helpers/http.helper';

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { subject, text, html } = req.body;

    if (!subject || !text || !html) return next(createError('All fields are required'));

    try {
        await sendgridMail.send(mailOptions(subject, text, html));
        return createSuccess(res, 200, 'Email sent successfully', { mesage: 'sent' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err);
        if (err?.response.body) {
            console.error(
                '%cerror mail.controller.ts line:16 ',
                'color: red; display: block; width: 100%;',
                err.response.body,
            );
        }
        return next(createError('Message could not be sent'));
    }
};
