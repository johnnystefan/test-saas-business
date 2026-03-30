import { Inject, Injectable } from '@nestjs/common';
import { LogoutUseCase } from '../../domain/use-cases/logout.use-case';
import type { IUserRepository } from '../../domain/user/i-user.repository';
import { AUTH_TOKENS } from '../auth.tokens';

@Injectable()
export class LogoutProvider extends LogoutUseCase {
  constructor(
    @Inject(AUTH_TOKENS.USER_REPOSITORY) userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  async handle(dto: Parameters<LogoutUseCase['execute']>[0]): Promise<void> {
    await this.execute(dto);
  }
}
