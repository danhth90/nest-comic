import { Injectable } from '@nestjs/common';
import { ConfigurationService } from 'src/shared/configuration/configuration.service';
import { KeySplit } from 'src/shared/keysplit.const';

const fs = require('fs');
const http = require('http');
@Injectable()
export class TruyentranhaudoService {
    private siteCrawler: string = KeySplit.TTAD.Host;
    // private browserInstance = browserObject.startBrowser();

    constructor(private _configSvr: ConfigurationService) {
    }

    public async newUpdate(){
        let page;
        try {
            page = await this._configSvr.browser.newPage();
        
        } catch (error) {
            await this._configSvr.initBrowser()
            page = await this._configSvr.browser.newPage();
        }
        console.log(`Navigating to ${this.siteCrawler}...`);
        const lengthSite = this.siteCrawler.length;
        // Navigate to the selected page
        await page.goto(this.siteCrawler);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.fa.fa-newspaper-o');
        // Get the link to all the required books
        let urls = await page.$$eval('.card-body .row-last-update .thumb-item-flow', links => {
            let link = links.map(el => {
                const href = el.querySelector(".thumb-wrapper>a").href;
                const title = el.querySelector(".thumb_attr>a")?.title;
                const converPage = el.querySelector(".thumb-wrapper>a .img-in-ratio")?.dataset?.bg;
                return {
                    link: href,
                    title,
                    converPage
                }
            });
            return link;
        });
        for (let index = 0; index < urls.length; index++) {
            urls[index].link = urls[index].link.substr(this.siteCrawler.length);

        }
        return urls;
    }

    public async getListChapter(commicName) {
        try {
            return await this.scraper(this._configSvr.browser, `${this.siteCrawler}${commicName}`);
        } catch (error) {
            console.log(error)
            return { statusCode: error.code, Msg: error.message }
        }
    }

    public async getImageByChapter(chapter: string) {
        return await this.splitContentGetImage(this._configSvr.browser, `${this.siteCrawler}${chapter}`);
    }

    private async splitContentGetImage(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.waitForSelector('.chapter-content');
        let urls = await page.$$eval('div.chapter-content img.chapter-img', links => {
            links = links.map(el => el.src);

            return links;
        })
        return urls;
    }

    async download(url, res) {
        var Stream = require('stream').Transform;
        return http.request(url, function (response) {
            var data = new Stream();

            response.on('data', function (chunk) {
                data.push(chunk);
            });

            response.on('end', function () {
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

    async scraper(browser, url) {
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
}