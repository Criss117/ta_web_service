import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaModule } from '@/src/prisma/prisma.module';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports: [PrismaModule],
})
export class HealthModule {}
