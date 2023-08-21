import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { LoggingService } from './logging/logging.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { CustomExceptionFilter } from './logging/exception/exception.filter';

async function bootstrap() {
  const logger = new LoggingService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new CustomExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //removes extra fields from body request
    }),
  );

  process.on('uncaughtException', (error) => {
    logger.error('\nUncaught exception happened', error.stack);
    process.exitCode = 1;
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      promise,
    );
  });

  /* To check uncaughtException catching and logging uncomment below code:*/

  // setTimeout(() => {
  //   throw new Error();
  // }, 2000);

  /* ______________________________________________________________________*/
  /* To check unhandledRejection catching and logging uncomment below code:*/

  // const promise = new Promise((_, reject) => {
  //   setTimeout(() => {
  //     reject('Promise to reject');
  //   }, 300);
  // });
  // promise.then((value) => value);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 4000;

  const filePath = path.resolve(__dirname, 'doc', 'api.yaml');
  const document: any = yaml.load(fs.readFileSync(filePath, 'utf8'));
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
