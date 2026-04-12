import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly svc: ProductsService) { }

    @Get()
    findAll(@Query() q: { category?: string; search?: string; country?: string }) {
        return this.svc.findAll({ category: q.category, search: q.search, countryCode: q.country });
    }

    @Get('categories')
    getCategories() {
        return this.svc.getCategories();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.svc.findBySlug(slug);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    create(@Body() body: any) {
        return this.svc.create(body);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    update(@Param('id') id: string, @Body() body: any) {
        return this.svc.update(id, body);
    }

    @Put(':id/toggle')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    toggle(@Param('id') id: string) {
        return this.svc.toggleActive(id);
    }
}
