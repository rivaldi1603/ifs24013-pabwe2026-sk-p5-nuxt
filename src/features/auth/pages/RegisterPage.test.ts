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
});