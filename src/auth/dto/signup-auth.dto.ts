import { IsEmail, IsNotEmpty,MinLength } from 'class-validator';

export class SignupAuthDto {
    @IsNotEmpty({message:"firstname is required"})
    firstname:string

    @IsNotEmpty({message:"lastname is required"})
    lastname:string

    @IsNotEmpty({message:"Email is required"})
    @IsEmail({},{message:"Email is Invalid"})
    email: string;
  
    @IsNotEmpty({message:"Password required"})
    @MinLength(6,{message:"Password lenght must be greater than 6"})
    password: string;
}
