import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log('\x1b[32mLOG %s\x1b[0m', optionalParams, message);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error('\x1b[31mERROR %s\x1b[0m', optionalParams, message);
  }

  // error(message: any) {
  //   console.error('\x1b[31mERROR %s\x1b[0m', message);
  // }

  warn(message: any, ...optionalParams: any[]) {
    console.warn('\x1b[33mWARN %s\x1b[0m', optionalParams, message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug('DEBUG', optionalParams, message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log('VERBOSE', optionalParams, message);
  }
}
