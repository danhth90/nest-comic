import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { KeySplit } from 'src/shared/keysplit.const';

const { curly } = require('node-libcurl');
const querystring = require('querystring');
const fs = require('fs');
const request = require('request');
const http = require('http');
const browserObject = require('./../../browser');
@Injectable()
export class TruyentranhaudoService {
    private comicName: string;
    private siteCrawler: string = KeySplit.TTAD.Host;
    private browserInstance = browserObject.startBrowser();
    constructor() {
        
    }

    public async getListChapter(commicName) {
        try {
            return await this.scrapeAll(this.browserInstance, `${this.siteCrawler}${commicName}.html`);
        } catch (error) {
            console.log(error)
            return {statusCode: error.code, Msg: error.message}
        }
        
        
        
    }

    public async getImageByChapter(chapter: string) {
        let browser = await this.browserInstance;
        return await this.splitContentGetImage(browser, `${this.siteCrawler}${chapter}`);
    }

    private async splitContentGetImage(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.waitForSelector('body');
        let urls = await page.$$eval('.chapter-content', links => {
            console.log(links)
            links = links.map(el => el.querySelector('img.chapter-img')?.src);
            
            return links;
        });
        return urls;
        // data = data.replace(/(\r\n|\n|\r)/gm, "");
        // const $ = cheerio.load(data);
        // const eleLi: any = $(KeySplit.TTAD.KeyImg);
        // let dataImg = [];
        // let that = this;
        // $(eleLi).each(function(){
        //     const str = $(this).attr("src");

        // if (str.indexOf("http") === -1)
        //     dataImg.push(KeySplit.TTAD.Host + str);
        // else
        // {
        //     dataImg.push(str);
        // }
        // });

        // return dataImg;
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

    async scraper(browser, url){
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        // Navigate to the selected page
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.card-body');
        // Get the link to all the required books
        let urls = await page.$$eval('.list-chapters li', links => {
            links = links.map(el => el.querySelector('a').href);
            
            return links;
        });
        for (let index = 0; index < urls.length; index++) {
             urls[index] = urls[index].substr(this.siteCrawler.length);
            
        }
        return urls;
    }

    
  async scrapeAll(browserInstance, url){
    let browser;
    try{
        browser = await browserInstance;
        return await this.scraper(browser,url);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}
}
