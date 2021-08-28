import { Module } from '@nestjs/common';
import { ConfigurationService } from 'src/shared/configuration/configuration.service';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { TruyentranhaudoService } from './truyentranhaudo/truyentranhaudo.service';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, TruyentranhaudoService, ConfigurationService]
})
export class CrawlerModule {}
