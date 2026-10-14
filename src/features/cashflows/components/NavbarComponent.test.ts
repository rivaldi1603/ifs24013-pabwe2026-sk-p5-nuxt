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
    expect(img.exists()).toBe(true);
    await img.trigger('error');
    expect(img.attributes('src')).toContain('data:image/svg+xml');
  });

  it('does not fetch me if already loaded', async () => {
    const { mount } = await import('@vue/test-utils');
    const { createMockPinia, testRoutes } = await import('../../../test-utils');
    const { createRouter, createMemoryHistory } = await import('vue-router');
    const pinia = createMockPinia();
    const usersStore = useUsersStore(pinia);
    usersStore.me = { name: 'Loaded' };
    usersStore.asyncGetMe = vi.fn();
    const router = createRouter({ history: createMemoryHistory(), routes: testRoutes });
    mount(NavbarComponent, { global: { plugins: [pinia, router] } });
    expect(usersStore.asyncGetMe).not.toHaveBeenCalled();
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