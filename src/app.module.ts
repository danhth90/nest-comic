import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [HttpModule, CrawlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
