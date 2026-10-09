import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import ProfilePage from './ProfilePage.vue';
import { useUsersStore } from '../states/usersStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('ProfilePage', () => {
  it('renders loading state', () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.isLoading = true;
    store.me = null;
    expect(wrapper.text()).toContain('Profil Saya');
  });

  it('handles updates', async () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.me = { name: 'User', email: 'a@a' };
    store.asyncUpdateBio = vi.fn().mockResolvedValue({});
    store.asyncUpdatePassword = vi.fn().mockResolvedValue({});
    store.asyncUploadAvatar = vi.fn().mockResolvedValue({});
    
    await nextTick();
    
    // Bio
    const forms = wrapper.findAll('form');
    await forms[0].trigger('submit.prevent');
    expect(store.asyncUpdateBio).toHaveBeenCalled();
    
    // Password
    await forms[1].trigger('submit.prevent');
    expect(store.asyncUpdatePassword).toHaveBeenCalled();
    
    // Avatar error handle file length
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [new File([''], 'test')] });
    await input.trigger('change');
  });
  
  it('handles updates error', async () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.me = { name: 'User', email: 'a@a' };
    store.asyncUpdateBio = vi.fn().mockRejectedValue(new Error('fail'));
    store.asyncUpdatePassword = vi.fn().mockRejectedValue(new Error('fail'));
    store.asyncUploadAvatar = vi.fn().mockRejectedValue(new Error('fail'));
    
    await nextTick();
    
    // Bio
    const forms = wrapper.findAll('form');
    await forms[0].trigger('submit.prevent');
    
    // Password
    await forms[1].trigger('submit.prevent');
    
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [new File([''], 'test')] });
    await input.trigger('change');
  });
});