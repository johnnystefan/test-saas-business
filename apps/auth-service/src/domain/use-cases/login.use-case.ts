import * as bcrypt from 'bcryptjs';
import { type UserRole, AuthenticationFailedError } from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import type { User } from '../user/user.entity';

export type LoginInput = {
  readonly email: string;
  readonly password: string;
  readonly tenantId: string;
};

export type LoginOutput = {
  readonly userId: string;
  readonly email: string;
  readonly role: UserRole;
  readonly tenantId: string;
};

export class LoginUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.existingActiveUser(input.email, input.tenantId);
    await this.verifiedPassword(input.password, user.passwordHash);
    return this.loginOutput(user);
  }

  private async existingActiveUser(
    email: string,
    tenantId: string,
  ): Promise<User> {
    const user = await this.userRepository.findByEmail(email, tenantId);
    if (!user)
      throw new AuthenticationFailedError({ reason: 'invalid credentials' });
    if (user.status !== 'ACTIVE')
      throw new AuthenticationFailedError({ reason: 'user is inactive' });
    return user;
  }

  private async verifiedPassword(plain: string, hash: string): Promise<void> {
    const isValid = await bcrypt.compare(plain, hash);
    if (!isValid)
      throw new AuthenticationFailedError({ reason: 'invalid credentials' });
  }

  private loginOutput(user: User): LoginOutput {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
