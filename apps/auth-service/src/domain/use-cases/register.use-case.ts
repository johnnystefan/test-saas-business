import * as bcrypt from 'bcryptjs';
import {
  USER_ROLE,
  type UserRole,
  ResourceAlreadyExistsError,
} from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import type { User } from '../user/user.entity';

export type RegisterInput = {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly role?: UserRole;
  readonly tenantId: string;
};

export type RegisterOutput = {
  readonly user: User;
};

export class RegisterUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existing = await this.userRepository.findByEmail(
      input.email,
      input.tenantId,
    );
    if (existing) {
      throw new ResourceAlreadyExistsError({
        resource: 'User',
        field: 'email',
        value: input.email,
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role ?? USER_ROLE.MEMBER,
      tenantId: input.tenantId,
    });

    return { user };
  }
}
