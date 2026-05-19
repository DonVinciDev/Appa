import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() hace que este modulo este disponible para toda la app
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}