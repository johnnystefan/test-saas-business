import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { executeUseCase } from './execute-use-case';

describe('executeUseCase', () => {
  it('should return the result when action succeeds', async () => {
    const result = await executeUseCase(
      () => Promise.resolve({ id: '1', name: 'Test' }),
      {},
      'Failed',
    );

    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should map a known domain error to the corresponding HTTP exception', async () => {
    const action = () => Promise.reject(new Error('MEMBER_NOT_FOUND'));

    await expect(
      executeUseCase(
        action,
        { MEMBER_NOT_FOUND: [NotFoundException, 'Member not found'] },
        'Failed to process',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should include the mapped message in the HTTP exception', async () => {
    const action = () => Promise.reject(new Error('MEMBER_ALREADY_ENROLLED'));

    await expect(
      executeUseCase(
        action,
        {
          MEMBER_ALREADY_ENROLLED: [
            ConflictException,
            'Member is already enrolled in this club',
          ],
        },
        'Failed',
      ),
    ).rejects.toThrow('Member is already enrolled in this club');
  });

  it('should throw InternalServerErrorException for unmapped errors with string fallback', async () => {
    const action = () => Promise.reject(new Error('UNEXPECTED_DB_ERROR'));

    await expect(
      executeUseCase(action, {}, 'Something went wrong'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should use the fallback message for unmapped errors', async () => {
    const action = () => Promise.reject(new Error('UNEXPECTED'));

    await expect(
      executeUseCase(action, {}, 'Operation failed'),
    ).rejects.toThrow('Operation failed');
  });

  it('should support multiple error mappings', async () => {
    const errorMap = {
      NOT_FOUND: [NotFoundException, 'Not found'] as const,
      CONFLICT: [ConflictException, 'Already exists'] as const,
    };

    await expect(
      executeUseCase(
        () => Promise.reject(new Error('CONFLICT')),
        errorMap,
        'Failed',
      ),
    ).rejects.toThrow(ConflictException);

    await expect(
      executeUseCase(
        () => Promise.reject(new Error('NOT_FOUND')),
        errorMap,
        'Failed',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw a custom fallback exception when fallback is a tuple', async () => {
    const action = () => Promise.reject(new Error('ANY_ERROR'));

    await expect(
      executeUseCase(action, {}, [
        UnauthorizedException,
        'Invalid or expired token',
      ]),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should use the custom fallback message from the tuple', async () => {
    const action = () => Promise.reject(new Error('SOME_ERROR'));

    await expect(
      executeUseCase(action, {}, [UnauthorizedException, 'Session expired']),
    ).rejects.toThrow('Session expired');
  });

  it('should prefer errorMap match over custom fallback tuple', async () => {
    const action = () => Promise.reject(new Error('TOKEN_EXPIRED'));

    await expect(
      executeUseCase(
        action,
        { TOKEN_EXPIRED: [NotFoundException, 'Token not found'] },
        [UnauthorizedException, 'Auth failed'],
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
