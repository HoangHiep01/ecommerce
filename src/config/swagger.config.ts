import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

// const bearerAuthOption = {{
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//     },
//     'JWT-auth'};

export const documentBuiler = new DocumentBuilder()
	.setTitle('Ecommerce example')
    .setDescription('The ecommerce API description')
    .setVersion('1.0')
    .addTag('Ecommerce')
    .addBearerAuth()
    .build();

export const documentBuilerOptions: SwaggerDocumentOptions = {
	operationIdFactory: (
		controllerKey: string,
		methodKey: string
	) => methodKey
};