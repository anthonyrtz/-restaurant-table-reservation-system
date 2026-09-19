import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Note: role is intentionally NOT accepted here — self-registration
  // always creates a "customer" account. Staff/admin accounts are promoted
  // by an admin via PATCH /users/:id, not created via public registration.
}
