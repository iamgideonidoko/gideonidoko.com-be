import ajvInstance from './ajvInstance';
import { JSONSchemaType } from 'ajv';
import { NewUser } from '../interfaces/user.interface';

const newUserSchema: JSONSchemaType<NewUser> = {
    type: 'object',
    properties: {
        name: { type: 'string', nullable: false, minLength: 2 },
        username: { type: 'string', nullable: false, minLength: 2 },
        email: { type: 'string', nullable: false, format: 'email' },
        githubusername: { type: 'string', nullable: false, minLength: 2 },
        password: { type: 'string', nullable: false, minLength: 4 },
        retype_password: { type: 'string', nullable: false, minLength: 4 },
    },
    required: ['name', 'username', 'email', 'password', 'retype_password', 'githubusername'],
    additionalProperties: false,
};

// export a validate function
export const newUserAjvValidate = ajvInstance.compile(newUserSchema);
