import { Module } from '@nestjs/common';
import { SyncRemoteService } from './sync-remote.service';
import { SyncRemoteController } from './sync-remote.controller';
import { PrismaModule } from '@/src/prisma/prisma.module';

@Module({
  controllers: [SyncRemoteController],
  providers: [SyncRemoteService],
  imports: [PrismaModule],
})
export class SyncRemoteModule {}
