import { NestFactory } from '@nestjs/core';
import { MergeServiceModule } from './merge.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MergeServiceModule, {
    transport: Transport.GRPC,
    options: {
      package: 'merge',
      protoPath: join(process.cwd(), 'proto/merge.proto'),
      url: `0.0.0.0:${process.env.MERGE_PORT || 5000}`,
    },
  });

  await app.listen();
}

bootstrap().catch((err) => {
  console.error('Error starting Merge Service:', err);
  process.exit(1);
});
