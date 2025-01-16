import { IsEmail, IsNotEmpty,IsOptional,IsString,MinLength } from 'class-validator';

export class EditUserDto {
    @IsString()
    @IsOptional()
    firstname?: string

    @IsString()
    @IsOptional()
    lastname?: string

    @IsEmail({},{message:"Email is Invalid"})
    @IsOptional()
    email?: string;

}
