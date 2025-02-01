import { NestFactory } from '@nestjs/core';
import { MetaPhotoApiModule } from './application/modules/meta-photo-api.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(MetaPhotoApiModule);

  // Global validation (sanitization)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('MetaPhoto API')
    .setDescription('API for organizing photo libraries')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const port = 3000;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`);
}

bootstrap();
