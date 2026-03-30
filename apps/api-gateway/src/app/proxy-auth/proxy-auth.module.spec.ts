import { Test, TestingModule } from '@nestjs/testing';
import { AuthProxyController } from './controllers/auth-proxy.controller';
import { ProxyAuthModule } from './proxy-auth.module';

describe('ProxyAuthModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProxyAuthModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should compile and register AuthProxyController', () => {
    const controller = moduleRef.get(AuthProxyController);
    expect(controller).toBeDefined();
  });
});
