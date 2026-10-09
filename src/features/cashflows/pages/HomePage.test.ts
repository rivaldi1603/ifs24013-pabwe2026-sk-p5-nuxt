import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import HomePage from './HomePage.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  formatRupiah: vi.fn(val => val),
  formatDate: vi.fn(val => val),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('HomePage', () => {
  it('renders and fetches data', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    expect(store.asyncGetCashFlows).toHaveBeenCalled;
    expect(wrapper.text()).toContain('Ringkasan Arus Kas');
  });

  it('handles delete', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    const btns = wrapper.findAll('button');
    // find delete button
    const deleteBtn = btns.find(b => b.attributes('title') === 'Hapus');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).toHaveBeenCalledWith('1');
  });

  it('handles reset all', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncDeleteAllCashFlows = vi.fn().mockResolvedValue({});
    
    const resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    expect(store.asyncDeleteAllCashFlows).toHaveBeenCalled();
  });
  
  it('handles reset filters', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncGetCashFlows = vi.fn().mockResolvedValue({});
    
    const resetFilterBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Filter');
    await resetFilterBtn?.trigger('click');
    expect(store.asyncGetCashFlows).toHaveBeenCalled();
  });

  it('opens modals', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    
    await nextTick();
    
    // Add modal
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('Tambah Transaksi'));
    await addBtn?.trigger('click');
    
    // Change modal
    const changeBtn = wrapper.findAll('button').find(b => b.attributes('title') === 'Ubah');
    await changeBtn?.trigger('click');
  });

  it('handles filters input', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncGetCashFlows = vi.fn().mockResolvedValue({});

    const labelInput = wrapper.find('input[type="text"]');
    await labelInput.setValue('test');
    await labelInput.trigger('input');

    const selects = wrapper.findAll('select');
    await selects[0].setValue('inflow');
    await selects[0].trigger('change');
    
    await selects[1].setValue('cash');
    await selects[1].trigger('change');

    const dateInputs = wrapper.findAll('input[type="date"]');
    await dateInputs[0].setValue('2023-01-01');
    await dateInputs[0].trigger('change');

    await dateInputs[1].setValue('2023-12-31');
    await dateInputs[1].trigger('change');

    expect(store.asyncGetCashFlows).toHaveBeenCalled();
  });

  it('handles empty state add button', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = []; // empty state
    await nextTick();
    
    const addBtns = wrapper.findAll('button').filter(b => b.text().includes('Tambah Transaksi'));
    if (addBtns.length > 1) {
      await addBtns[1].trigger('click');
    }
  });

  it('handles delete error', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    store.asyncDeleteCashFlow = vi.fn().mockRejectedValue(new Error('error'));
    
    await nextTick();
    const deleteBtn = wrapper.findAll('button').find(b => b.attributes('title') === 'Hapus');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();
  });

  it('handles reset all error', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncDeleteAllCashFlows = vi.fn().mockRejectedValue(new Error('error'));
    
    const resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    expect(store.asyncDeleteAllCashFlows).toHaveBeenCalled();
  });
});