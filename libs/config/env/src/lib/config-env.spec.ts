import { configEnv } from './config-env';

describe('configEnv', () => {
  it('should work', () => {
    expect(configEnv()).toEqual('config-env');
  });
});
