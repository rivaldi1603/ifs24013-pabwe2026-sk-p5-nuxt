import { describe, it, expect, vi } from 'vitest';
import { getUsers, getMe, updateBio, uploadAvatar, updatePassword } from './userApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('userApi', () => {
  it('getUsers works', async () => {
    await getUsers();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users');
  });
  it('getMe works', async () => {
    await getMe();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me');
  });
  it('updateBio works', async () => {
    await updateBio({name: 'A'});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me', expect.any(Object));
  });
  it('uploadAvatar works', async () => {
    const f = new File([''], 'test.png');
    await uploadAvatar(f);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/photo', expect.any(Object));
  });
  it('updatePassword works', async () => {
    await updatePassword({password: 'A'});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/password', expect.any(Object));
  });
});