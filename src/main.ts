import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //removes extra fields from body request
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 4000;
  console.log(port);

  const filePath = path.resolve(__dirname, 'doc', 'api.yaml');
  const document: any = yaml.load(fs.readFileSync(filePath, 'utf8'));
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
