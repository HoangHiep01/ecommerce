import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { instance } from './logger/winston.logger';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  await app.listen(configService.get<number>('port'));
}
bootstrap();
