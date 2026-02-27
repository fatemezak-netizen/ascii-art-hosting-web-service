import { NestFactory } from '@nestjs/core';
import { ApiServiceModule } from './api-service.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './utils/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.API_PORT || 4444);
}

bootstrap().catch((err) => {
  console.error('Error starting API Service:', err);
  process.exit(1);
});
