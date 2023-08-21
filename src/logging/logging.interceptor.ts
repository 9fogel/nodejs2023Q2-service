import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, body, query } = req;
    const { statusCode } = res;

    const now = Date.now();
    // return next.handle().pipe(
    //   tap((data) => {
    //     console.log(data);
    //     console.log(`After... ${Date.now() - now}ms`);
    //   }),
    // );

    // return next.handle().pipe(map((data) => ({ data })));

    // return next.handle();

    return next.handle().pipe(
      map((data) => {
        new LoggingService().log(
          `\n[REQUEST]: ${method} ${url} body: ${JSON.stringify(
            body,
          )} query: ${JSON.stringify(
            query,
          )}\n[RESPONSE]: statusCode: ${statusCode} [${Date.now() - now}ms]\n`,
          context.getClass().name,
        );
        return data;
      }),
    );
  }
}
