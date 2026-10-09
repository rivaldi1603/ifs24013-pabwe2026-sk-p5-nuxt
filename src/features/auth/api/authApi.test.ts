import { describe, it, expect, vi } from 'vitest';
import { login, register } from './authApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
  putAccessToken: vi.fn(),
}));

describe('authApi', () => {
  it('login puts access token on success', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ data: { token: '123' } });
    await login({ email: 'a@a.com', password: '123' });
    expect(apiHelper.putAccessToken).toHaveBeenCalledWith('123');
  });

  it('login works if no token in response', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({});
    await login({ email: 'a@a.com', password: '123' });
    // Should not crash
  });

  it('register calls fetchApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ status: 200 });
    await register({ email: 'a@a.com', password: '123' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/register', expect.any(Object));
  });
});