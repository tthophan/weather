import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .addTag('your-tag')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
}
