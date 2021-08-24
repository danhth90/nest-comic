import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { KeySplit } from 'src/shared/keysplit.const';

const { curly } = require('node-libcurl');
const querystring = require('querystring');
const fs = require('fs');
const request = require('request');
const http = require('http')
@Injectable()
export class TruyentranhaudoService {
    private comicName: string;
    private siteCrawler: string = KeySplit.TTAD.Host;
    constructor() {

    }

    public async getListChapter(commicName) {
        try {
            const { statusCode, data, headers } = await curly.get(`${this.siteCrawler}${commicName}.html`);    
            if(statusCode == 200)
            {
                try {
                    const dataChapter = await this.splitChapter(data);
                    return {statusCode, data:dataChapter};
                } catch (error) {
                    return {statusCode, error};
                }
            }
            else{
                return {statusCode: statusCode, Msg: "Loi gi do"}
            }
        } catch (error) {
            console.log(error)
            return {statusCode: error.code, Msg: error.message}
        }
        
        
        
    }

    public async getImageByChapter(chapter: string) {
        const { statusCode, data, headers } = await curly.get(`${this.siteCrawler}${chapter}`, {
            postFields: querystring.stringify({
                field: 'value',
            }),
        });
        
        return this.splitContentGetImage(data);
    }

    private async splitContentGetImage(data: string) {
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        const $ = cheerio.load(data);
        const eleLi: any = $(KeySplit.TTAD.KeyImg);
        let dataImg = [];
        let that = this;
        $(eleLi).each(function(){
            const str = $(this).attr("src");

        if (str.indexOf("http") === -1)
            dataImg.push(KeySplit.TTAD.Host + str);
        else
        {
            dataImg.push(str);
        }
        });

        return dataImg;
    }

    private async handleElementImage($){
        
    }

    private async splitChapter(data: string) {
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        const $ = cheerio.load(data);
        const eleLi: any = $(KeySplit.TTAD.KeyChapter);
        let listChapter = [];
        $(eleLi).each(function (i, liElement) {
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

    async download(url, res) {
    var Stream = require('stream').Transform;                                       
    
    
    return http.request(url, function(response) {                                        
      var data = new Stream();                                                    
    
      response.on('data', function(chunk) {                                       
        data.push(chunk);                                                         
      });                                                                         
    
      response.on('end', function() {                                             
        fs.writeFileSync('image.png', data.read());                               
      });                                                                         
    }).end();

        /* Create an empty file where we can save data */
        // const file = fs.createWriteStream(dest);
        /* Using Promises so that we can use the ASYNC AWAIT syntax */
        // await new Promise((resolve, reject) => {
        //     request({
        //         uri: url,
        //         gzip: true,
        //     }).on('finish', async (data)=>{
        //         console.log(data)
        //     })
        //     .pipe(file)
        //         .on('finish', async () => {
        //             console.log(`The file is finished downloading.`);
        //             resolve(true);
        //         })
        //         .on('error', (error) => {
        //             reject(error);
        //         });
        // }).catch((error) => {
        //     console.log(`Something happened: ${error}`);
        // });
    }
}
