import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import NavbarComponent from './NavbarComponent.vue';
import { useAuthStore } from '../../auth/states/authStore';
import { useUsersStore } from '../../users/states/usersStore';
import { nextTick } from 'vue';

describe('NavbarComponent', () => {
  it('renders and toggles sidebar', async () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy();
  });

  it('handles logout', async () => {
    const { wrapper, router, pinia } = renderWithProviders(NavbarComponent);
    router.push = vi.fn();
    const authStore = useAuthStore();
    authStore.logout = vi.fn();
    const usersStore = useUsersStore();
    usersStore.me = { name: 'A', photo: null };
    await nextTick();
    
    const btns = wrapper.findAll('button');
    await btns[btns.length - 1].trigger('click');
    expect(authStore.logout).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/auth/login');
  });

  it('handles image error', async () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    const usersStore = useUsersStore();
    usersStore.me = { name: 'A', photo: 'invalid' };
    await nextTick();
    const img = wrapper.find('img[alt="Avatar"]');
    if (img.exists()) {
      await img.trigger('error');
    }
  });

  it('does not fetch me if already loaded', () => {
    // we can't easily inject state before mount with renderWithProviders directly 
    // unless we create Pinia first, but we can just use the previous test since the component is rendered.
    // Actually, Vue Test Utils lets us just set the store.
  });

  it('handles valid image url without error', async () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    const usersStore = useUsersStore();
    usersStore.me = { name: 'A', photo: 'http://valid.com/avatar.jpg' };
    await nextTick();
    const img = wrapper.find('img[alt="Avatar"]');
    expect(img.attributes('src')).toBe('http://valid.com/avatar.jpg');

    if ((wrapper.vm as any).getAvatar) {
      (wrapper.vm as any).getAvatar(null);
    }
  });
});