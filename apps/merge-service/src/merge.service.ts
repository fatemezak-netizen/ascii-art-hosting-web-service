import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class MergeService {
  private readonly logger = new Logger(MergeService.name);
  private readonly basePath = path.resolve('data/images');

  async merge(sha256: string) {
    this.logger.log(`Starting merge for ${sha256}`);
    const imagePath = path.join(this.basePath, sha256);

    const metadataPath = path.join(imagePath, 'metadata.json');

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    const chunksDir = path.join(imagePath, 'chunks');

    const finalPath = path.join(imagePath, 'final.txt');
    const files = fs
      .readdirSync(chunksDir)
      .sort((a, b) => Number(a) - Number(b));

    const writeStream = fs.createWriteStream(finalPath);

    for (const file of files) {
      const content = fs.readFileSync(path.join(chunksDir, file));
      writeStream.write(content);
    }

    writeStream.end();
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => {
        this.logger.log(`Finished writing merged file for ${sha256}`);
        resolve();
      });
      writeStream.on('error', (error) => {
        this.logger.error(
          `Error writing merged file for ${sha256}: ${error.message}`,
        );
        reject(error);
      });
    });
    const finalContent = fs.readFileSync(finalPath);

    const hash = crypto.createHash('sha256').update(finalContent).digest('hex');

    if (hash !== sha256) {
      return {
        success: false,
        message: 'hash mismatch',
      };
    }

    metadata.merged = true;

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return {
      success: true,
      message: 'merged',
    };
  }
}
