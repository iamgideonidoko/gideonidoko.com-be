import ajvInstance from './ajvInstance';
import { JSONSchemaType } from 'ajv';
import { LoginUser, RefreshToken } from '../interfaces/auth.interface';

const loginUserSchema: JSONSchemaType<LoginUser> = {
    type: 'object',
    properties: {
        username: { type: 'string', nullable: false, minLength: 2 },
        password: { type: 'string', nullable: false, minLength: 4 },
    },
    required: ['username', 'password'],
    additionalProperties: false,
};

// export a validate function
export const loginUserAjvValidate = ajvInstance.compile(loginUserSchema);

const refreshTokenSchema: JSONSchemaType<RefreshToken> = {
    type: 'object',
    properties: {
        refreshToken: { type: 'string', nullable: false },
    },
    required: ['refreshToken'],
    additionalProperties: false,
};

// export a validate function
export const refreshTokenAjvValidate = ajvInstance.compile(refreshTokenSchema);
