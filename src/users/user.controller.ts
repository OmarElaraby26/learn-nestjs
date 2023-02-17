import {
    Body,
    Req,
    Param,
    Controller,
    Get,
    Patch,
    HttpCode,
    HttpStatus,
    HttpException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

import { UpdateUserDto } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getUser(@Req() req, @Param('id') id: string) {
        const user = await this.userService.findUserById(id);
        console.log('userId: ', id)
        console.log(user);
        if (id != req.user.username) {
            throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
        }
        return user;
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async updateUser(@Req() req, @Param('id') id: string, @Body() newData: UpdateUserDto) {
        if (id != req.user.username) {
            throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
        }
        return this.userService.findUserAndUpdate(id, newData);
    }
}