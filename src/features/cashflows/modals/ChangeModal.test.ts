import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import ChangeModal from './ChangeModal.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('ChangeModal', () => {
  it('populates fields', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1', type: 'inflow' } } });
    await nextTick();
    expect(wrapper.text()).toContain('Ubah Pencatatan Arus Kas');
  });

  it('handles submit success', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const store = useCashFlowsStore();
    store.asyncUpdateCashFlow = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncUpdateCashFlow).toHaveBeenCalled();
    expect(wrapper.emitted('refresh')).toBeTruthy();
  });
  
  it('handles submit error', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const store = useCashFlowsStore();
    store.asyncUpdateCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncUpdateCashFlow).toHaveBeenCalled();
  });

  it('handles close', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const btns = wrapper.findAll('button');
    await btns[0].trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});