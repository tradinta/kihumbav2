import {
    IsEmail, IsString, IsOptional, MinLength,
    IsEnum, IsDateString, Length, Matches,
} from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export class OnboardingDto {
    @IsString()
    @Length(3, 20, { message: 'Username must be 3–20 characters' })
    @Matches(/^[a-z0-9_]+$/, { message: 'Username may only contain lowercase letters, numbers, and underscores' })
    username: string;

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsDateString()
    dateOfBirth: string;

    @IsEnum(GenderEnum)
    gender: GenderEnum;

    @IsString()
    county: string;
}
