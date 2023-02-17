import {
    IsNotEmpty,
} from 'class-validator';

export class CredentialDto {
    @IsNotEmpty()
    usernameOrEmail: string

    @IsNotEmpty()
    password: string
}