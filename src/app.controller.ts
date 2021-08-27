import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

const browserObject = require('./browser');
const pageScraper = require('./pageScraper');
@Controller()
export class AppController {
  
  // private browserInstance = browserObject.startBrowser();
  
  constructor(private readonly appService: AppService) {
    //this.scrapeAll(this.browserInstance);
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  async scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await pageScraper.scraper(browser);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}
}
