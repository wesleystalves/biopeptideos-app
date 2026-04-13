import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS — dev: aceita qualquer origem
    app.enableCors({
        origin: true,
        credentials: true,
    });


    // Validação global de DTOs
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    // Prefixo /api em todas as rotas
    app.setGlobalPrefix('api');

    // Swagger docs em /api/docs
    const config = new DocumentBuilder()
        .setTitle('Peptídeos Health API')
        .setDescription('API backend independente do Supabase')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API rodando na porta ${port}`);
}
bootstrap();
