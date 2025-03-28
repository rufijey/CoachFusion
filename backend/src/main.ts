import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import {join} from "path";
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'fingerprint'],
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Coach Fusion')
        .setDescription('REST API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // app.use('/static', express.static(join(__dirname, '..', 'static')));

    app.useGlobalPipes(new ValidationPipe());

    app.use(cookieParser())
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
