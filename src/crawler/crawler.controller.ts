import { Controller, Get, Query, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { TruyentranhaudoService } from './truyentranhaudo/truyentranhaudo.service';

@Controller('crawler')
export class CrawlerController {
    constructor(private ttadSvr: TruyentranhaudoService){

    }

    @Get('get-new')
    public async newUpdate(){
        return this.ttadSvr.newUpdate();
    }

    @Get('get-chapters')
    public async GetChapters(@Query() comicname: any){
        return this.ttadSvr.getListChapter(comicname.name);
    }

    @Get('read-chapter')
    public async ReadChapter(@Query() chapter: any){
        return this.ttadSvr.getImageByChapter(chapter.name);
    }

    @Get('img')
    public async image(@Query() query,  @Res() response: Response){
        response = await this.ttadSvr.download(query.name, response);
        return response
    }
}
