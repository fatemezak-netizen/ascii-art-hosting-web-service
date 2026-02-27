import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { ImageRepository } from './image.repository';
import { RegisterImageDto } from './dto/register-image.dto';
import { UploadChunkDto } from './dto/upload-chunk.dto';
import { MergeClient } from '../grpc/merge.client';

@Injectable()
export class ImageService {
  constructor(
    private repo: ImageRepository,
    private mergeClient: MergeClient,
  ) {}

  register(dto: RegisterImageDto) {
    if (this.repo.exists(dto.sha256)) {
      throw new ConflictException('Image already exists');
    }

    const totalChunks = Math.ceil(dto.size / dto.chunk_size);

    this.repo.create({
      sha256: dto.sha256,
      size: dto.size,
      chunk_size: dto.chunk_size,
      total_chunks: totalChunks,
      uploaded_chunks: [],
      merged: false,
    });
  }

  async uploadChunk(sha256: string, dto: UploadChunkDto) {
    const metadata = this.repo.getMetadata(sha256);

    if (!metadata) throw new NotFoundException();

    this.repo.saveChunk(sha256, dto.id, dto.data);

    metadata.uploaded_chunks.push(dto.id);

    this.repo.saveMetadata(sha256, metadata);

    if (
      metadata.uploaded_chunks.length === metadata.total_chunks &&
      !metadata.merged
    ) {
      await this.mergeClient.requestToMerge(sha256);
    }
  }

  download(sha256: string) {
    const metadata = this.repo.getMetadata(sha256);

    if (!metadata || !metadata.merged) throw new NotFoundException();

    return this.repo.readFinal(sha256);
  }
}
