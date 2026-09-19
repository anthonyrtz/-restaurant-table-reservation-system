import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This is the "protected route" guard: apply it with @UseGuards(JwtAuthGuard)
// on any controller or route that must reject requests without a valid token.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
