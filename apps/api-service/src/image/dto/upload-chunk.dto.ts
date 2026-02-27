import { IsNumber, IsString } from 'class-validator';

export class UploadChunkDto {
  @IsNumber()
  id: number;

  @IsNumber()
  size: number;

  @IsString()
  data: string;
}
