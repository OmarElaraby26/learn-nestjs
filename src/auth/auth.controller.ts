import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { UserDto, CredentialDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() newUserData: UserDto) {
        return this.authService.createUser(newUserData);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() credential: CredentialDto) {
        const user = await this.authService.findUser(credential);
        const access_token: string = await this.authService.signToken(user._id);
        return {
            access_token,
        }
    }
}