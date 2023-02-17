import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/users.model';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


import * as bcrypt from 'bcryptjs';
import { isEmail } from '../../node_modules/validator';


import { UserDto, CredentialDto } from './dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private jwt: JwtService,
        private config: ConfigService) { }

    async createUser(newUserData: UserDto): Promise<any> {
        // I know this piece of code can be factored and enhanced
        const docHaveTheSameEmail = await this.UserModel.findOne({ email: newUserData.email }, { _id: 1 });
        if (docHaveTheSameEmail) {
            throw new HttpException('this email is already used!', HttpStatus.BAD_REQUEST);
        }

        const docHaveTheSameUsername = await this.UserModel.findOne({ _id: newUserData.username }, { _id: 1 });
        if (docHaveTheSameUsername) {
            throw new HttpException('this username is already used!', HttpStatus.BAD_REQUEST);
        }

        const newUser = new this.UserModel(newUserData);
        // store the new user in the database
        return newUser.save();
    }

    async findUser(credential: CredentialDto): Promise<any> {
        const property = isEmail(credential.usernameOrEmail) ? 'email' : '_id';
        const doc = {
            [property]: credential.usernameOrEmail
        };


        const projectedDoc = { username: 1, password: 1 };

        const searchedUser = await this.UserModel.findOne(doc, projectedDoc);


        if (!searchedUser) {
            throw new HttpException('Invalid username/email or password', HttpStatus.BAD_REQUEST);
        }

        const validPassword = await bcrypt.compare(credential.password, searchedUser.password);
        if (!validPassword) {
            throw new HttpException('Invalid username/email or password', HttpStatus.BAD_REQUEST);
        }
        // delete searchedUser.password;
        return searchedUser;
    }

    async signToken(userId: string): Promise<string> {
        const payload = {
            'username': userId,
        };
        const secret = this.config.get('AT_SECRET');

        return this.jwt.signAsync(
            payload,
            {
                expiresIn: this.config.get('AT_TTL'),
                secret,
            },
        );
    }
}