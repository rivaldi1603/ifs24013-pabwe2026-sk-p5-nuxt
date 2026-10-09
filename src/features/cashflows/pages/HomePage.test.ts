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
    const deleteBtn = btns.find(b => b.text() === 'Hapus');
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
    const changeBtn = wrapper.findAll('button').find(b => b.text() === 'Ubah');
    await changeBtn?.trigger('click');
  });
});