import { Controller, Post, Body } from '@nestjs/common';
import { SyncRemoteService } from './sync-remote.service';
import { SyncRemoteDto } from './dto/sync-remote.dto';

@Controller('sync-remote')
export class SyncRemoteController {
  constructor(private readonly syncRemoteService: SyncRemoteService) {}

  @Post()
  synchronize(@Body() syncRemoteDto: SyncRemoteDto) {
    console.log(syncRemoteDto);
    return this.syncRemoteService.synchronize(syncRemoteDto);
  }
}
