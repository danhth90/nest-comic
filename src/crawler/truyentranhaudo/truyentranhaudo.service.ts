import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { KeySplit } from 'src/shared/keysplit.const';

const { curly } = require('node-libcurl');
const querystring = require('querystring');

@Injectable()
export class TruyentranhaudoService {
    private comicName: string;
    private siteCrawler: string = KeySplit.TTAD.Host;
    constructor(){

    }

    public async getListChapter(commicName){
        const { statusCode, data, headers } = await curly.post(`${this.siteCrawler}${commicName}.html`, {
            postFields: querystring.stringify({
                field: 'value',
            }),
            // can use `postFields` or `POSTFIELDS`
        });
        
        const dataChapter = this.splitChapter(data);
        console.log(dataChapter)
        return dataChapter
    }

    public async getImageByChapter(chapter: string) {
        const { statusCode, data, headers } = await curly.post(`${this.siteCrawler}${chapter}`, {
            postFields: querystring.stringify({
                field: 'value',
            }),
            // can use `postFields` or `POSTFIELDS`
        })


        return this.splitContentGetImage(data);
    }

    private async splitContentGetImage(data: string) {
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        const $ = cheerio.load(data);
        const eleLi: any = $(KeySplit.TTAD.KeyImg);
        let dataImg = [];
        console.log($(eleLi).html())
        $(eleLi).each(function(i, liElement){
            dataImg.push(KeySplit.TTAD.Host + $(this).attr("src"));
            
        });
        return dataImg;
    }

    private async splitChapter(data:string) {
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        const $ = cheerio.load(data);
        const eleLi: any = $(KeySplit.TTAD.KeyChapter);
        let listChapter = [];
        $(eleLi).each(function(i, liElement){
            const alink = $(this).html();
            const $$ = cheerio.load(alink);
            const link = $$("a").attr("href");
            const title = $$("a").attr("title");
            let obj = {
                link,
                title
            }
            listChapter = [
                ...listChapter,
                obj
            ]
        });
        return listChapter;
    }
}
