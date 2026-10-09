import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import RegisterPage from './RegisterPage.vue';
import { useAuthStore } from '../states/authStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('RegisterPage', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(RegisterPage);
    expect(wrapper.text()).toContain('Nama Lengkap');
  });

  it('handles register success', async () => {
    const { wrapper, router } = renderWithProviders(RegisterPage);
    router.push = vi.fn();
    const store = useAuthStore();
    store.asyncRegister = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncRegister).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/auth/login');
  });

  it('handles register error', async () => {
    const { wrapper } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.asyncRegister = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncRegister).toHaveBeenCalled();
  });

  it('handles input events and password toggle', async () => {
    const { wrapper } = renderWithProviders(RegisterPage);
    const nameInput = wrapper.find('#register-name-input');
    await nameInput.setValue('Test User');
    await nameInput.trigger('input');

    const emailInput = wrapper.find('#register-email-input');
    await emailInput.setValue('test@test.com');
    await emailInput.trigger('input');
    
    const passwordInput = wrapper.find('#register-password-input');
    await passwordInput.setValue('password');
    await passwordInput.trigger('input');

    const toggleBtn = wrapper.find('button[type="button"]');
    await toggleBtn.trigger('click');
    expect(passwordInput.attributes('type')).toBe('text');
    await toggleBtn.trigger('click');
    expect(passwordInput.attributes('type')).toBe('password');
  });
});