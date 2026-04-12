import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard que não rejeita requisições sem token — apenas anexa o user se houver JWT válido
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        return user || null;
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
