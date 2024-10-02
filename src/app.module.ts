import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ServiceModule } from './modules/service/service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UserModule, ServiceModule],
})
export class AppModule {}
