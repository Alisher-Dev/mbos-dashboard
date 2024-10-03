import { Module } from '@nestjs/common';
import { ShartnomaService } from './shartnoma.service';
import { ShartnomaController } from './shartnoma.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shartnoma, User])],
  controllers: [ShartnomaController],
  providers: [ShartnomaService],
})
export class ShartnomaModule {}
