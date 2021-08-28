import { Injectable } from '@nestjs/common';
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'config';
const browserObject = require('./../../browser');

@Injectable()
export class ConfigurationService {
  private environmentHosting: string = process.env.NODE_ENV || 'development';
  private browserInstance = browserObject.startBrowser();
  get(name: string): string {
    return process.env[name] || get(name);
  }

  get isDevelopment(): boolean {
    return this.environmentHosting === 'development';
  }
  public browser;

  constructor(){
    try {
      this.initBrowser();
    }
    catch (err) {
      console.log("Could not resolve the browser instance => ", err);
    }
  }

  public async initBrowser(){
    this.browser = await this.browserInstance;
  }

  // public getTypeOrmConfig(): TypeOrmModuleOptions {
  //     return {
  //       type: 'postgres',

  //       host: this.get('POSTGRES_HOST'),
  //       port: parseInt(this.get('POSTGRES_PORT')),
  //       username: this.get('POSTGRES_USER'),
  //       password: this.get('POSTGRES_PASSWORD'),
  //       database: this.get('POSTGRES_DATABASE'),

  //       entities: ['**/*.entity{.ts,.js}'],

  //       migrationsTableName: 'migration',

  //       migrations: ['src/migration/*.ts'],
  //       synchronize: true,
  //       autoLoadEntities: true,
  //       cli: {
  //         migrationsDir: 'src/migration',
  //       },

  //       ssl: !this.isDevelopment
  //     };
  //   }
}