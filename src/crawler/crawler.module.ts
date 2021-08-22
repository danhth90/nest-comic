import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { TruyentranhaudoService } from './truyentranhaudo/truyentranhaudo.service';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, TruyentranhaudoService]
})
export class CrawlerModule {}
