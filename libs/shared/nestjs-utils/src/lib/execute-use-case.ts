import { HttpException, InternalServerErrorException } from '@nestjs/common';

type HttpExceptionConstructor = new (message: string) => HttpException;

/**
 * Executes a use case and maps domain error messages to NestJS HTTP exceptions.
 *
 * Replaces the repetitive try/catch pattern in NestJS services:
 *
 * ```ts
 * // Before (repeated in every method):
 * try {
 *   return await this.useCase.execute(dto);
 * } catch (error) {
 *   if ((error as Error).message === 'NOT_FOUND') throw new NotFoundException('...');
 *   if ((error as Error).message === 'CONFLICT') throw new ConflictException('...');
 *   throw new InternalServerErrorException('Failed to ...');
 * }
 *
 * // After:
 * return executeUseCase(
 *   () => this.useCase.execute(dto),
 *   { NOT_FOUND: [NotFoundException, 'Resource not found'] },
 *   'Failed to execute operation',
 * );
 *
 * // With custom fallback exception (e.g. for auth refresh):
 * return executeUseCase(
 *   () => this.refreshUseCase.execute(dto),
 *   {},
 *   [UnauthorizedException, 'Invalid or expired refresh token'],
 * );
 * ```
 */
export async function executeUseCase<T>(
  action: () => Promise<T>,
  errorMap: Readonly<
    Record<string, readonly [HttpExceptionConstructor, string]>
  >,
  fallback: string | readonly [HttpExceptionConstructor, string],
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    const message = (error as Error).message;
    const mapping = errorMap[message];

    if (mapping) {
      const [ExceptionClass, httpMessage] = mapping;
      throw new ExceptionClass(httpMessage);
    }

    if (typeof fallback === 'string') {
      throw new InternalServerErrorException(fallback);
    }

    const [FallbackException, fallbackMessage] = fallback;
    throw new FallbackException(fallbackMessage);
  }
}
