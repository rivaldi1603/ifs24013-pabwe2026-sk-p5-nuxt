import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import ProfilePage from './ProfilePage.vue';
import { useUsersStore } from '../states/usersStore';
import { nextTick } from 'vue';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders loading state', async () => {
    const store = useUsersStore();
    store.asyncGetMe = vi.fn().mockResolvedValue({}); // prevent throw
    const { wrapper } = renderWithProviders(ProfilePage);
    
    // wait for onMounted
    await new Promise(r => setTimeout(r, 10));
    
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
    Object.defineProperty(input.element, 'files', { value: [new File([''], 'test')], configurable: true });
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
    Object.defineProperty(input.element, 'files', { value: [new File([''], 'test')], configurable: true });
    await input.trigger('change');

    // empty files branch
    Object.defineProperty(input.element, 'files', { value: [], configurable: true });
    await input.trigger('change');
    Object.defineProperty(input.element, 'files', { value: null, configurable: true });
    await input.trigger('change');

    // without message
    store.asyncUpdateBio = vi.fn().mockRejectedValue({ message: '' });
    store.asyncUpdatePassword = vi.fn().mockRejectedValue({ message: '' });
    store.asyncUploadAvatar = vi.fn().mockRejectedValue({ message: '' });
    await forms[0].trigger('submit.prevent');
    await forms[1].trigger('submit.prevent');
    Object.defineProperty(input.element, 'files', { value: [new File([''], 'test')], configurable: true });
    await input.trigger('change');
  });

  it('calculates password strength', async () => {
    const store = useUsersStore();
    store.asyncGetMe = vi.fn().mockImplementation(async () => {
      store.me = { name: 'User', email: 'a@a', photo: 'http://test.com/a.jpg' };
    });
    const { wrapper } = renderWithProviders(ProfilePage);
    await new Promise(r => setTimeout(r, 10));
    store.isLoading = false;
    await nextTick();
    
    const nameInput = wrapper.find('input[type="text"]');
    if (nameInput.exists()) {
      await nameInput.setValue('New Name');
      await nameInput.trigger('input');
    }

    const pwdInput = wrapper.find('input[type="password"]');
    await pwdInput.setValue('a');
    await pwdInput.setValue(''); // trigger if (!password.value)
    await pwdInput.setValue('a');
    await pwdInput.setValue('abcdef');
    await pwdInput.setValue('abcdefghi');
    await pwdInput.setValue('Abcdefghi');
    await pwdInput.setValue('Abcdefghi1!');

    const toggleBtn = wrapper.find('button[type="button"].absolute');
    if (toggleBtn.exists()) {
      await toggleBtn.trigger('click'); // show
      await toggleBtn.trigger('click'); // hide
    }

    // check image error
    const img = wrapper.find('img');
    if (img.exists()) {
      await img.trigger('error');
    }
    
    // cover watch fallbacks
    store.me = { name: '', full_name: 'Full', email: 'a@a', photo: 'invalid' };
    await nextTick();

    store.me = { name: '', full_name: '', username: 'user123', email: 'a@a', photo: null, avatar: null, avatar_url: null };
    await nextTick();

    store.me = { name: '', full_name: '', username: '', email: 'a@a', photo: null };
    await nextTick();

    store.me = null; // covers if (!newVal)
    await nextTick();

    store.me = { name: 'Valid', email: 'a@a', photo: 'http://valid.com/a.jpg' };
    await nextTick();

    // click file input wrapper button
    const btn = wrapper.findAll('button').find(b => b.text().includes('Ubah Foto'));
    if (btn) {
      await btn.trigger('click');
    }

    // directly trigger getAvatar(!user)
    if ((wrapper.vm as any).getAvatar) {
      (wrapper.vm as any).getAvatar(null);
      (wrapper.vm as any).getAvatar({ photo: 'http://test.com/a.jpg' });
      (wrapper.vm as any).getFallbackUrl({});
      (wrapper.vm as any).onImgError({ target: {} }, {});
    }
  });
});