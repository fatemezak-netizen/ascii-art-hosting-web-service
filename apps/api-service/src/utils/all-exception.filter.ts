import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(
      'An error occurred',
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'An error occurred.';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') message = exceptionResponse;
      else if ((exceptionResponse as any).message)
        message = (exceptionResponse as any).message;
    }

    switch (status as HttpStatus) {
      case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
        message = 'Unsupported payload format';
        break;
      case HttpStatus.NOT_FOUND:
        message = 'Image not found';
        break;
    }

    response.status(status).json({
      code: status,
      message,
    });
  }
}
