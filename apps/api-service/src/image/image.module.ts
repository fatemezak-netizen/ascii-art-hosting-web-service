import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { FileStorage } from '../storage/file.storage';
import { ImageRepository } from './image.repository';
import { GrpcModule } from '../grpc/grpc.module';
import { MergeClient } from '../grpc/merge.client';

@Module({
  imports: [GrpcModule],
  controllers: [ImageController],
  providers: [ImageService, FileStorage, ImageRepository, MergeClient],
})
export class ImageModule {}
