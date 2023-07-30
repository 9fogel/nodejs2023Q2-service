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
  const port = configService.get<number>('port');

  // const config = new DocumentBuilder()
  //   .setTitle('Home Library Service')
  //   .setDescription('REST API description')
  //   .setVersion('1.0')
  //   .addTag('restAPI')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  const filePath = path.resolve(__dirname, 'doc', 'api.yaml');
  const document: any = yaml.load(fs.readFileSync(filePath, 'utf8'));

  // const document = SwaggerModule.createDocument(app, config);
  // fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  // const document: any = yaml.load(fs.readFileSync('../doc/api.yaml', 'utf8'));
  SwaggerModule.setup('doc', app, document);

  //   import { readFileSync } from 'fs';
  // import * as yaml from 'js-yaml';
  // import { join } from 'path';

  // const YAML_CONFIG_FILENAME = 'api.yaml';

  // export const document = () => {
  //   return yaml.load(
  //     fs.readFileSync(path.join(__dirname, 'doc', 'api.yaml'), 'utf8'),
  //   ) as Record<string, any>;
  // };
  // SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
