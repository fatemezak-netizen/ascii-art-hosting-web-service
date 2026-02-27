import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  HttpCode,
} from '@nestjs/common';

import type { Response } from 'express';

import { ImageService } from './image.service';
import { RegisterImageDto } from './dto/register-image.dto';
import { UploadChunkDto } from './dto/upload-chunk.dto';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @HttpCode(201)
  register(@Body() registerBody: RegisterImageDto) {
    this.imageService.register(registerBody);
    return { message: 'Image successfully registered' };
  }
  @Post(':sha256/chunks')
  @HttpCode(201)
  async upload(
    @Param('sha256') sha256: string,
    @Body() chunkData: UploadChunkDto,
  ) {
    await this.imageService.uploadChunk(sha256, chunkData);
    return { message: 'Chunk successfully uploaded' };
  }

  @Get(':sha256')
  download(@Param('sha256') sha256: string, @Res() res: Response) {
    const image = this.imageService.download(sha256);
    res.setHeader('Content-Type', 'text/plain');
    res.send(image);
  }
}
