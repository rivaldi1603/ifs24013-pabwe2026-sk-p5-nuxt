import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import AddModal from './AddModal.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('AddModal', () => {
  it('renders when open', () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    expect(wrapper.text()).toContain('Tambah Pencatatan Arus Kas');
  });

  it('handles submit success', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const store = useCashFlowsStore();
    store.asyncAddCashFlow = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncAddCashFlow).toHaveBeenCalled();
    expect(wrapper.emitted('refresh')).toBeTruthy();
  });

  it('handles submit error', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const store = useCashFlowsStore();
    store.asyncAddCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncAddCashFlow).toHaveBeenCalled();
  });

  it('handles close', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const btns = wrapper.findAll('button');
    await btns[0].trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});