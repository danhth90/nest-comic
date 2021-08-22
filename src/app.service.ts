import { HttpService, Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {

  }
  async getHello(): Promise<any> {

    

return "tui la danh"
  }

  
  
}
