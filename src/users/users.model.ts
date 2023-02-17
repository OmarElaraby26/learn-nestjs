
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose'

import { UserObjProps } from './dto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop(UserObjProps._id)
    _id: string;

    @Prop(UserObjProps.firstName)
    firstName: string;

    @Prop(UserObjProps.lastName)
    lastName: string;


    @Prop(UserObjProps.email)
    email: string;

    @Prop(UserObjProps.phoneNumber)
    phoneNumber: string;

    @Prop(UserObjProps.password)
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    if (obj._id) {
        obj['username'] = obj._id;
        delete obj._id;
    }
    return obj;
}

// export const UserSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         minlength: 3,
//         maxlength: 35,
//         lowercase: true,
//         trim: true,
//         required: true,
//         alias: 'username',
//     },
//     firstName: {
//         type: String,
//         minlength: 2,
//         maxlength: 35,
//         trim: true,
//         required: true,
//     },
//     lastName: {
//         type: String,
//         minlength: 2,
//         maxlength: 35,
//         trim: true,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim: true,
//         unique: true,
//         validate: isEmail,
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true,
//         validate: {
//             validator: function (phonenumber: string) {
//                 return /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/.test(phonenumber);
//             },
//             message: 'Invalid phone number',
//         }
//     },
//     password: {
//         type: String,
//         minlength: 2,
//         maxlength: 35,
//         required: true,
//     }
// })