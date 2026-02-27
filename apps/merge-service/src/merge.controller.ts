import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MergeService } from './merge.service';
@Controller()
export class MergeController {
  constructor(private MergeService: MergeService) {}

  @GrpcMethod('MergeService', 'MergeImage')
  async MergeImage({ sha256 }: { sha256: string }) {
    await this.MergeService.merge(sha256);
    return {
      success: true,
      message: 'merged',
    };
  }
}
