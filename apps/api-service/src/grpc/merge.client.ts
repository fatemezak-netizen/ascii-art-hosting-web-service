import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface MergeService {
  MergeImage(data: { sha256: string }): Observable<{ success: boolean }>;
}

@Injectable()
export class MergeClient implements OnModuleInit {
  private service: MergeService;
  private readonly logger = new Logger(MergeClient.name);

  constructor(
    @Inject('MERGE_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<MergeService>('MergeService');
    this.logger.log('MergeService client initialized');
  }

  async requestToMerge(sha256: string) {
    this.logger.log(`Starting merge request for sha256: ${sha256}`);

    const mergeRequest = await firstValueFrom(
      this.service.MergeImage({ sha256 }),
    );
    if (!mergeRequest?.success) {
      this.logger.error(`Error during merge request for sha256: ${sha256}`);
      throw new InternalServerErrorException({
        message: 'The merger was unsuccessful.',
      });
    }
    return;
  }
}
