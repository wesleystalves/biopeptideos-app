import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CouponService } from './coupon.service';
import { IsString, IsOptional, IsNumber, IsInt, IsBoolean, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCouponDto {
    @IsString()
    code: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsIn(['percent', 'fixed'])
    @IsOptional()
    discountType?: string;

    @IsNumber()
    @Min(0.01)
    @Type(() => Number)
    discountValue: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxUses?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    minAmount?: number;

    @IsString()
    @IsOptional()
    allowedPlans?: string; // JSON: '["basic","premium"]'

    @IsString()
    @IsOptional()
    startsAt?: string;

    @IsString()
    @IsOptional()
    expiresAt?: string;
}

export class UpdateCouponDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsIn(['percent', 'fixed'])
    @IsOptional()
    discountType?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discountValue?: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxUses?: number | null;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    minAmount?: number | null;

    @IsString()
    @IsOptional()
    allowedPlans?: string | null;

    @IsString()
    @IsOptional()
    startsAt?: string | null;

    @IsString()
    @IsOptional()
    expiresAt?: string | null;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

// Endpoint público apenas para validar cupom (sem retornar dados sensíveis)
export class ValidateCouponDto {
    @IsString()
    code: string;

    @IsString()
    @IsIn(['basic', 'premium'])
    plan: string;

    @IsNumber()
    @Type(() => Number)
    amount: number;
}

function requireAdmin(req: any) {
    if (!req.user?.isAdmin) throw new ForbiddenException('Acesso restrito a administradores');
}

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    // ── PÚBLICO: validar cupom antes de mostrar no frontend ───────────────
    @Post('validate')
    @ApiOperation({ summary: 'Valida um cupom e retorna o preço final (público)' })
    async validate(@Body() dto: ValidateCouponDto) {
        const result = await this.couponService.validate(dto.code, dto.plan, dto.amount);
        return {
            valid: true,
            finalAmount: result.finalAmount,
            discountApplied: result.discountApplied,
        };
    }

    // ── ADMIN: CRUD completo ───────────────────────────────────────────────
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista todos os cupons (admin)' })
    async findAll(@Request() req: any) {
        requireAdmin(req);
        return this.couponService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findOne(@Request() req: any, @Param('id') id: string) {
        requireAdmin(req);
        return this.couponService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria um novo cupom (admin)' })
    async create(@Request() req: any, @Body() dto: CreateCouponDto) {
        requireAdmin(req);
        return this.couponService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edita um cupom (admin)' })
    async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCouponDto) {
        requireAdmin(req);
        return this.couponService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove um cupom (admin)' })
    async remove(@Request() req: any, @Param('id') id: string) {
        requireAdmin(req);
        return this.couponService.remove(id);
    }
}
