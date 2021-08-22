import { Controller, Get, Query, Req } from '@nestjs/common';
import { TruyentranhaudoService } from './truyentranhaudo/truyentranhaudo.service';

@Controller('crawler')
export class CrawlerController {
    constructor(private ttadSvr: TruyentranhaudoService){

    }

    @Get('get-chapters')
    public async GetChapters(@Query() comicname: any){
        return this.ttadSvr.getListChapter(comicname.name);
    }

    @Get('read-chapter')
    public async ReadChapter(@Query() chapter: any){
        return this.ttadSvr.getImageByChapter(chapter.name);
    }
}
