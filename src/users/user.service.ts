import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/users.model';

import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async findUserById(userId: string) {
        const searchedUser = await this.UserModel.findById(userId);
        if (!searchedUser) {
            throw new HttpException('Invalid user Id', HttpStatus.BAD_REQUEST);
        }
        return searchedUser;
    }
    async findUserAndUpdate(userId: string, newData: UpdateUserDto) {
        return this.UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: newData },
            {
                returnOriginal: false,
            }
        );
    }
}