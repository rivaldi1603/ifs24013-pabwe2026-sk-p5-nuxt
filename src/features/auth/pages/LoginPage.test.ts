import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import LoginPage from './LoginPage.vue';
import { useAuthStore } from '../states/authStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('LoginPage', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(LoginPage);
    expect(wrapper.text()).toContain('Email');
    expect(wrapper.text()).toContain('Password');
  });

  it('handles login success', async () => {
    const { wrapper, router } = renderWithProviders(LoginPage);
    router.push = vi.fn();
    const store = useAuthStore();
    store.asyncLogin = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncLogin).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('handles login error', async () => {
    const { wrapper } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.asyncLogin = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncLogin).toHaveBeenCalled();
  });

  it('handles input events and password toggle', async () => {
    const { wrapper } = renderWithProviders(LoginPage);
    const emailInput = wrapper.find('#login-email-input');
    await emailInput.setValue('test@test.com');
    await emailInput.trigger('input');
    
    const passwordInput = wrapper.find('#login-password-input');
    await passwordInput.setValue('password');
    await passwordInput.trigger('input');

    const toggleBtn = wrapper.find('button[type="button"]');
    await toggleBtn.trigger('click');
    expect(passwordInput.attributes('type')).toBe('text');
    await toggleBtn.trigger('click');
    expect(passwordInput.attributes('type')).toBe('password');
  });
});