import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()  // This will catch all exceptions
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest();
  
      // Determine the status code of the exception (default to 500 if not an HttpException)
      const status = exception instanceof HttpException ? exception.getStatus() : 500;
  
      // Safely handle the exception message
      const message = exception?.message || 'Internal server error';
  
      // Log the error (optional but useful for debugging)
      // this.logger.error(
      //   `${exception?.message || exception?.name} - ${request.url}`,
      //   exception?.stack,
      // );
  
      // Return only statusCode and message in the error response
      const errorResponse = {
        statusCode: status,
        message,
      };
  
      response.status(status).json(errorResponse);
    }
  }
  