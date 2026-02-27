import * as fs from 'fs';
import * as path from 'path';
import { ConflictException, Injectable } from '@nestjs/common';
import { FileStorage } from '../storage/file.storage';

@Injectable()
export class ImageRepository {
  constructor(private storage: FileStorage) {}

  exists(sha256: string): boolean {
    return fs.existsSync(this.storage.getImagePath(sha256));
  }

  create(metadata: { sha256: string; [key: string]: any }) {
    const dir = this.storage.getImagePath(metadata.sha256);
    const chunksDir = this.storage.getChunksPath(metadata.sha256);

    fs.mkdirSync(dir);
    fs.mkdirSync(chunksDir);

    fs.writeFileSync(
      this.storage.getMetadataPath(metadata.sha256),
      JSON.stringify(metadata, null, 2),
    );
  }

  getMetadata(sha256: string) {
    const path = this.storage.getMetadataPath(sha256);

    if (!fs.existsSync(path)) return null;

    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  saveMetadata(sha256: string, metadata: any) {
    fs.writeFileSync(
      this.storage.getMetadataPath(sha256),
      JSON.stringify(metadata, null, 2),
    );
  }

  saveChunk(sha256: string, id: number, data: string) {
    const chunkPath = path.join(
      this.storage.getChunksPath(sha256),
      id.toString(),
    );

    if (fs.existsSync(chunkPath)) {
      throw new ConflictException('Chunk already exists');
    }

    fs.writeFileSync(chunkPath, data);
  }

  readFinal(sha256: string): string {
    return fs.readFileSync(this.storage.getFinalPath(sha256), 'utf8');
  }
}
