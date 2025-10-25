import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('JEWELIA API')
    .setDescription('Production-ready REST API for JEWELIA - Jewelry Marketplace Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and registration')
    .addTag('Shops', 'Jewelry shop management')
    .addTag('Products', 'Product catalog and inventory')
    .addTag('Categories', 'Product categories (Gold, Silver, Diamond, Platinum)')
    .addTag('Orders', 'Order management and try-at-home requests')
    .addTag('Reviews', 'Product and shop reviews')
    .addTag('Locations', 'State, City, District, and Taluka management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 JEWELIA API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
