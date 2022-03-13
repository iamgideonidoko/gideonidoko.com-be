import ajvInstance from './ajvInstance';
import { JSONSchemaType } from 'ajv';
import { NewMail } from '../interfaces/mail.interface';

const newMailSchema: JSONSchemaType<NewMail> = {
    type: 'object',
    properties: {
        subject: { type: 'string', nullable: false },
        text: { type: 'string', nullable: false },
        html: { type: 'string', nullable: false },
    },
    required: ['subject', 'text', 'html'],
    additionalProperties: false,
};

// export validate functions
export const newMailAjvValidate = ajvInstance.compile(newMailSchema);
