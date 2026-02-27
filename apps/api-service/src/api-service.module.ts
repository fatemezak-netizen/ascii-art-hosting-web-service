import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [ImageModule, GrpcModule],
})
export class ApiServiceModule {}
