import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MERGE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'merge',
          protoPath: join(process.cwd(), 'proto/merge.proto'),
          url: process.env.MERGE_PACKAGE_URL || 'localhost:5000',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
