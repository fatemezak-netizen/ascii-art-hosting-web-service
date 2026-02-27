import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorage {
  basePath = path.resolve('data/images');

  constructor() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  getImagePath(sha256: string) {
    return path.join(this.basePath, sha256);
  }

  getChunksPath(sha256: string) {
    return path.join(this.getImagePath(sha256), 'chunks');
  }

  getMetadataPath(sha256: string) {
    return path.join(this.getImagePath(sha256), 'metadata.json');
  }

  getFinalPath(sha256: string) {
    return path.join(this.getImagePath(sha256), 'final.txt');
  }
}
