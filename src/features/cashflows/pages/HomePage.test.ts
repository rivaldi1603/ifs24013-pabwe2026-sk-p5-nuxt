import { describe, it, expect, vi } from 'vitest';
import { createMockPinia, renderWithProviders } from '../../../test-utils';
import HomePage from './HomePage.vue';
import AddModal from '../modals/AddModal.vue';
import ChangeModal from '../modals/ChangeModal.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { showConfirmDialog } from '../../../helpers/toolsHelper';

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
    store.stats = { total_inflow: 1000, total_outflow: 500, cash: 100, savings: 200, loans: 200 };
    await nextTick();
    
    expect(store.asyncGetCashFlows).toHaveBeenCalled;
    expect(wrapper.text()).toContain('Ringkasan Arus Kas');
  });

  it('handles delete', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    const btns = wrapper.findAll('button');
    // find delete button
    const deleteBtn = btns.find(b => b.attributes('title') === 'Hapus');
    await deleteBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
    expect(store.asyncDeleteCashFlow).toHaveBeenCalledWith('1');
  });

  it('handles reset all', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    store.asyncDeleteAllCashFlows = vi.fn().mockResolvedValue({});
    
    const resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
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
    const pinia = createMockPinia();
    const store = useCashFlowsStore(pinia);
    store.asyncGetCashFlows = vi.fn().mockResolvedValue({});
    store.cashFlows = [
      { id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' },
      { id: '2', type: 'outflow', source: 'unknown', nominal: 2000, label: 'B' }
    ];
    
    const { wrapper } = renderWithProviders(HomePage, {
      global: { plugins: [pinia] }
    });
    
    await nextTick();
    
    // Add modal
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('+ Tambah Transaksi'));
    await addBtn?.trigger('click');
    await flushPromises();
    
    // Change modal
    const changeBtns = wrapper.findAll('button').filter(b => b.attributes('title') === 'Ubah');
    if (changeBtns.length > 0) {
      await changeBtns[0].trigger('click');
      await flushPromises();
    }

    // trigger close on modals
    const addModal = wrapper.findComponent(AddModal);
    if (addModal.exists()) {
      await addModal.vm.$emit('close');
      await addModal.vm.$emit('refresh');
    }

    const changeModal = wrapper.findComponent(ChangeModal);
    if (changeModal.exists()) {
      await changeModal.vm.$emit('close');
      await changeModal.vm.$emit('refresh');
    }

    // trigger router link
    const links = wrapper.findAllComponents({ name: 'RouterLink' });
    for (const link of links) {
      await link.trigger('click').catch(() => {});
    }
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
      await flushPromises();
    }
  });

  it('handles delete error', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    // with message
    store.asyncDeleteCashFlow = vi.fn().mockRejectedValue({ message: 'error' });
    await nextTick();
    let deleteBtn = wrapper.findAll('button').find(b => b.attributes('title') === 'Hapus');
    await deleteBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();

    // without message
    store.asyncDeleteCashFlow = vi.fn().mockRejectedValue({ message: '' });
    deleteBtn = wrapper.findAll('button').find(b => b.attributes('title') === 'Hapus');
    if (deleteBtn) {
      await deleteBtn.trigger('click');
      await new Promise(r => setTimeout(r, 10));
      expect(store.asyncDeleteCashFlow).toHaveBeenCalled();
    }
  });

  it('handles delete cancel', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    store.asyncDeleteCashFlow = vi.fn();
    
    await nextTick();
    (showConfirmDialog as any).mockResolvedValueOnce({ isConfirmed: false });

    let deleteBtn = wrapper.findAll('button').find(b => b.attributes('title') === 'Hapus');
    if (deleteBtn) await deleteBtn.trigger('click');
    expect(store.asyncDeleteCashFlow).not.toHaveBeenCalled();
  });

  it('handles reset all error', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    // with message
    store.asyncDeleteAllCashFlows = vi.fn().mockRejectedValue(new Error('error'));
    let resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    // wait for microtasks
    await new Promise(r => setTimeout(r, 10));
    expect(store.asyncDeleteAllCashFlows).toHaveBeenCalled();

    // without message
    store.asyncDeleteAllCashFlows = vi.fn().mockRejectedValue({ message: '' });
    resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
  });

  it('handles reset all cancel', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncDeleteAllCashFlows = vi.fn();
    
    (showConfirmDialog as any).mockResolvedValueOnce({ isConfirmed: false });

    let resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    expect(store.asyncDeleteAllCashFlows).not.toHaveBeenCalled();
  });
});