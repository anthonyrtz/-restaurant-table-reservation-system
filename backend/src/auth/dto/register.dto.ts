import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';
export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
@MinLength(8, { message: 'password must be at least 8 characters' })
@Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
  message:
    'password must include at least one uppercase letter, one lowercase letter, and one special character',
})
password: string;
  @IsOptional()
  @IsString()
  phone?: string;

  // Note: role is intentionally NOT accepted here — self-registration
  // always creates a "customer" account. Staff/admin accounts are promoted
  // by an admin via PATCH /users/:id, not created via public registration.
}
