import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './api/health/health.module';
import { CommonModule } from './api/common/common.module';
import { ClientsModule } from './api/clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './api/seed/seed.module';
import { SyncRemoteModule } from './api/sync-remote/sync-remote.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    HealthModule,
    CommonModule,
    ClientsModule,
    PrismaModule,
    SeedModule,
    SyncRemoteModule,
  ],
})
export class AppModule {}
