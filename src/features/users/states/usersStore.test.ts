import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from './usersStore';
import * as userApi from '../api/userApi';

vi.mock('../api/userApi', () => ({
  getUsers: vi.fn(),
  getMe: vi.fn(),
  updateBio: vi.fn(),
  uploadAvatar: vi.fn(),
  updatePassword: vi.fn(),
}));

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asyncGetUsers works', async () => {
    const store = useUsersStore();
    (userApi.getUsers as any).mockResolvedValue({ data: { users: ['a'] } });
    await store.asyncGetUsers();
    expect(store.users).toEqual(['a']);

    (userApi.getUsers as any).mockResolvedValue({ data: { items: ['b'] } });
    await store.asyncGetUsers();
    expect(store.users).toEqual(['b']);

    (userApi.getUsers as any).mockResolvedValue({ data: ['c'] });
    await store.asyncGetUsers();
    expect(store.users).toEqual(['c']);

    (userApi.getUsers as any).mockResolvedValue(['d']);
    await store.asyncGetUsers();
    expect(store.users).toEqual(['d']);
  });
  
  it('asyncGetUsers works without data', async () => {
    const store = useUsersStore();
    (userApi.getUsers as any).mockResolvedValue(null);
    await store.asyncGetUsers();
    expect(store.users).toEqual([]);

    // not an array
    (userApi.getUsers as any).mockResolvedValue({ data: { users: {} } });
    await store.asyncGetUsers();
    expect(store.users).toEqual([]);
  });

  it('asyncGetMe works', async () => {
    const store = useUsersStore();
    (userApi.getMe as any).mockResolvedValue({ data: { user: {id: 1} } });
    await store.asyncGetMe();
    expect(store.me).toEqual({id: 1});

    // branch test
    (userApi.getMe as any).mockResolvedValue({ data: {id: 2} });
    await store.asyncGetMe();
    expect(store.me).toEqual({id: 2});

    (userApi.getMe as any).mockResolvedValue({ id: 3 });
    await store.asyncGetMe();
    expect(store.me).toEqual({id: 3});

    (userApi.getMe as any).mockResolvedValue(null);
    await store.asyncGetMe();
    expect(store.me).toBeNull();
  });

  it('asyncUpdateBio works', async () => {
    const store = useUsersStore();
    (userApi.updateBio as any).mockResolvedValue({});
    store.asyncGetMe = vi.fn();
    await store.asyncUpdateBio({});
    expect(store.asyncGetMe).toHaveBeenCalled();
  });

  it('asyncUploadAvatar works', async () => {
    const store = useUsersStore();
    (userApi.uploadAvatar as any).mockResolvedValue({});
    store.asyncGetMe = vi.fn();
    await store.asyncUploadAvatar(new File([''], 'a'));
    expect(store.asyncGetMe).toHaveBeenCalled();
  });

  it('asyncUpdatePassword works', async () => {
    const store = useUsersStore();
    (userApi.updatePassword as any).mockResolvedValue('ok');
    const res = await store.asyncUpdatePassword({});
    expect(res).toBe('ok');
  });

  it('handles errors in asyncGetUsers', async () => {
    const store = useUsersStore();
    (userApi.getUsers as any).mockRejectedValue(new Error('fail'));
    await expect(store.asyncGetUsers()).rejects.toThrow('fail');
    expect(store.users).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('handles errors in asyncGetMe', async () => {
    const store = useUsersStore();
    (userApi.getMe as any).mockRejectedValue(new Error('fail'));
    await expect(store.asyncGetMe()).rejects.toThrow('fail');
    expect(store.isLoading).toBe(false);
  });
});