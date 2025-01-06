import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDTO {
    @Expose()
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @Expose()
    @IsString()
    @IsNotEmpty({ message: 'password is required' })
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
