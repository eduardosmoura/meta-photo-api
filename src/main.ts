import { NestFactory } from '@nestjs/core';
import { MetaPhotoApiModule } from './application/modules/meta-photo-api.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(MetaPhotoApiModule);

  // Enable CORS with default settings (allows all origins)
  app.enableCors();

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
  SwaggerModule.setup('/', app, document, {
    customSiteTitle: 'MetaPhoto API',
    swaggerOptions: {
      url: '/api-json',
    },
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css',
    ],
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.min.js',
    ],
  });

  const port = 3000;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`);
}

bootstrap();
