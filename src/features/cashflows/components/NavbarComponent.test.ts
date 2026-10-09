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
    const { wrapper, router } = renderWithProviders(NavbarComponent);
    router.push = vi.fn();
    const authStore = useAuthStore();
    authStore.logout = vi.fn();
    const usersStore = useUsersStore();
    usersStore.me = { name: 'A', photo: null };
    await nextTick();
    
    const btns = wrapper.findAll('button');
    await btns[1].trigger('click');
    expect(authStore.logout).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/auth/login');
  });
});