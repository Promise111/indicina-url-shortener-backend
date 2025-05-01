import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UrlModule } from './url/url.module';
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
