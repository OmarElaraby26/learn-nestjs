import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    Length,
    Matches,
} from 'class-validator';

import { isEmail } from '../../../node_modules/validator';
import * as bcrypt from 'bcryptjs';

export const usernameRegex = /^[a-zA-Z]([a-zA-Z0-9]){2,14}$/;
export const UserObjProps = {
    _id: {
        minlength: 3,
        maxlength: 15,
        lowercase: true,
        trim: true,
        required: true,
        alias: 'username',
        validate: {
            validator: function (phoneNumber: string) {
                return usernameRegex.test(phoneNumber);
            },
            message: 'username must contains only english letters and numbers and start with english letter',
        }
    },
    firstName: {
        minlength: 2,
        maxlength: 35,
        trim: true,
        required: true,
    },
    lastName: {
        minlength: 2,
        maxlength: 35,
        trim: true,
        required: true,
    },
    email: {
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: isEmail,
    },
    phoneNumber: {
        required: true,
        trim: true,
        validate: {
            validator: function (phoneNumber: string) {
                return /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/.test(phoneNumber);
            },
            message: 'Invalid phone number',
        }
    },
    password: {
        minlength: 8,
        required: true,
        set: (pass: string): string => bcrypt.hashSync(pass, 12)
    }
}


export class UserDto {
    @Matches(usernameRegex, { message: UserObjProps._id.validate.message })
    @Length(UserObjProps._id.minlength, UserObjProps._id.maxlength)
    @IsNotEmpty()
    username: string;


    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @Length(UserObjProps.firstName.minlength, UserObjProps.firstName.maxlength)
    @IsNotEmpty()
    firstName: string;

    @Length(UserObjProps.lastName.minlength, UserObjProps.lastName.maxlength)
    @IsNotEmpty()
    lastName: string;

    @Length(UserObjProps.password.minlength, 64)
    @IsNotEmpty()
    password: string;
}