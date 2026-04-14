import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRE_PLAN_KEY = 'require_plan';
export const RequirePlan = (...plans: string[]) => {
    const { SetMetadata } = require('@nestjs/common');
    return SetMetadata(REQUIRE_PLAN_KEY, plans);
};

/**
 * PlanGuard — garante que o usuário tem o plano necessário para acessar a rota.
 *
 * Uso:
 *   @UseGuards(JwtAuthGuard, PlanGuard)
 *   @RequirePlan('premium')            // Só premium e admin
 *   @RequirePlan('basic', 'premium')   // Basic e premium (e admin sempre)
 */
@Injectable()
export class PlanGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredPlans: string[] = this.reflector.getAllAndOverride(REQUIRE_PLAN_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        // Sem decorator → acesso livre (para usuários autenticados)
        if (!requiredPlans || requiredPlans.length === 0) return true;

        const { user } = ctx.switchToHttp().getRequest();

        // Admin sempre tem acesso total
        if (user?.isAdmin) return true;

        // Verifica se o plano do usuário está na lista de planos permitidos
        if (!requiredPlans.includes(user?.plan)) {
            throw new ForbiddenException(
                `Seu plano (${user?.plan ?? 'free'}) não tem acesso a esta funcionalidade. ` +
                `Necessário: ${requiredPlans.join(' ou ')}.`,
            );
        }

        return true;
    }
}
