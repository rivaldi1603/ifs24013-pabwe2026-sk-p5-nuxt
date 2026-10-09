import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './authStore';
import * as authApi from '../api/authApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock('../../../helpers/apiHelper', () => ({
  removeAccessToken: vi.fn(),
}));

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asyncLogin works', async () => {
    const store = useAuthStore();
    (authApi.login as any).mockResolvedValue('ok');
    const res = await store.asyncLogin({});
    expect(res).toBe('ok');
    expect(store.isLogin).toBe(false);
  });

  it('asyncRegister works', async () => {
    const store = useAuthStore();
    (authApi.register as any).mockResolvedValue('ok');
    const res = await store.asyncRegister({});
    expect(res).toBe('ok');
    expect(store.isRegister).toBe(false);
  });

  it('logout works', () => {
    const store = useAuthStore();
    store.authUser = { id: 1 };
    store.logout();
    expect(store.authUser).toBeNull();
    expect(apiHelper.removeAccessToken).toHaveBeenCalled();
  });
});