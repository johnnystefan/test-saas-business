import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  DomainError,
  DOMAIN_ERROR_TYPE,
  type DomainErrorCode,
} from '@saas/shared-types';

type HttpResponse = {
  status: (code: number) => { json: (body: unknown) => void };
};

const HTTP_STATUS_MAP: Partial<Record<DomainErrorCode, number>> = {
  [DOMAIN_ERROR_TYPE.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DOMAIN_ERROR_TYPE.RESOURCE_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [DOMAIN_ERROR_TYPE.RESOURCE_CONFLICT]: HttpStatus.CONFLICT,
  [DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION]: HttpStatus.UNPROCESSABLE_ENTITY,
  [DOMAIN_ERROR_TYPE.BUSINESS_OPERATION_NOT_ALLOWED]: HttpStatus.FORBIDDEN,
  [DOMAIN_ERROR_TYPE.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [DOMAIN_ERROR_TYPE.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [DOMAIN_ERROR_TYPE.AUTH_AUTHENTICATION_FAILED]: HttpStatus.UNAUTHORIZED,
  [DOMAIN_ERROR_TYPE.AUTH_ACCESS_DENIED]: HttpStatus.FORBIDDEN,
  [DOMAIN_ERROR_TYPE.EXTERNAL_SERVICE_UNAVAILABLE]:
    HttpStatus.SERVICE_UNAVAILABLE,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();
    const status = this.toHttpStatus(exception.code);

    this.logger.warn(
      `DomainError [${exception.code}]: ${exception.message}`,
      exception.context,
    );

    response.status(status).json({
      statusCode: status,
      error: exception.title,
      message: exception.message,
      code: exception.code,
    });
  }

  private toHttpStatus(code: DomainErrorCode): number {
    return HTTP_STATUS_MAP[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
