import { Module } from '@nestjs/common';
import { ServerPaidService } from './server-paid.service';
import { ServerPaidController } from './server-paid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerPaid } from './entities/server-paid.entity';
import { Server } from '../server/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerPaid, Server])],
  controllers: [ServerPaidController],
  providers: [ServerPaidService],
})
export class ServerPaidModule {}
