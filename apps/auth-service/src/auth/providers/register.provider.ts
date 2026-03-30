import { Inject, Injectable } from '@nestjs/common';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import type { IUserRepository } from '../../domain/user/i-user.repository';
import { AUTH_TOKENS } from '../auth.tokens';

@Injectable()
export class RegisterProvider extends RegisterUseCase {
  constructor(
    @Inject(AUTH_TOKENS.USER_REPOSITORY) userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  async handle(
    dto: Parameters<RegisterUseCase['execute']>[0],
  ): Promise<{ user: { id: string; email: string; name: string } }> {
    const { user } = await this.execute(dto);
    return { user: { id: user.id, email: user.email, name: user.name } };
  }
}
