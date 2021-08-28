import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
const browserObject = require('./browser');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
