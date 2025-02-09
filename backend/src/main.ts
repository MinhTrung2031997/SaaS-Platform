import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { DefaultInternalExceptionFilter } from './common/filter/exception.filter';
import { DefaultValidationOptions } from './common/config/validation.config';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  app.enableCors();

  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);
  const basePath = configService.get('BASE_PATH');
  app.setGlobalPrefix(basePath);
  app.use(json({ limit: '16mb' }));
  app.use(urlencoded({ extended: true, limit: '16mb' }));

  app.useGlobalFilters(new DefaultInternalExceptionFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe(DefaultValidationOptions));

  const config = new DocumentBuilder()
    .setTitle('Sass Platform APIs')
    .setDescription('API Documentation for Sass Platform  Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(basePath + '/docs', app, document);

  const port = configService.get('PORT');
  await app.listen(Number(port), '0.0.0.0');
  logger.log(`Application listening on port: ${port}`);
  logger.log(
    `Swagger UI is available on http: ${await app.getUrl()}${basePath}/docs`,
  );
}
bootstrap();
