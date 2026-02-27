import { IsString, IsNumber } from 'class-validator';

export class RegisterImageDto {
  @IsString()
  sha256: string;

  @IsNumber()
  size: number;

  @IsNumber()
  chunk_size: number;
}
