import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const documentBuiler = new DocumentBuilder()
    .setTitle('Ecommerce example')
    .setDescription('The ecommerce API description')
    .setVersion('1.0')
    .addTag('Ecommerce')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentBuilerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    documentBuiler,
    documentBuilerOptions,
  );
  SwaggerModule.setup('api/v1', app, document);
}
