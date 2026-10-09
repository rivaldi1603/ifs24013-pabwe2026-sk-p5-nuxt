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
    
    // with message
    store.asyncAddCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncAddCashFlow).toHaveBeenCalled();

    // without message
    store.asyncAddCashFlow = vi.fn().mockRejectedValue({});
    await wrapper.find('form').trigger('submit.prevent');
  });

  it('handles close', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const btns = wrapper.findAll('button');
    await btns[0].trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('handles inputs', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const inputs = wrapper.findAll('input');
    await inputs[1].setValue('1000');
    await inputs[1].trigger('input');

    // trigger empty/non-digit input
    await inputs[1].setValue('abc');
    await inputs[1].trigger('input');

    await inputs[0].setValue('label');
    await inputs[0].trigger('input');

    const textarea = wrapper.find('textarea');
    await textarea.setValue('desc');
    await textarea.trigger('input');

    const selects = wrapper.findAll('select');
    await selects[0].setValue('inflow');
    await selects[0].trigger('change');
    
    await selects[1].setValue('cash');
    await selects[1].trigger('change');
  });
});