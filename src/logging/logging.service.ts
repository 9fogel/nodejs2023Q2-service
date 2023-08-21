import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log('LOG', optionalParams, message);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error('ERROR', optionalParams, message);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn('WARN', optionalParams, message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug('DEBUG', optionalParams, message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log('VERBOSE', optionalParams, message);
  }
}
