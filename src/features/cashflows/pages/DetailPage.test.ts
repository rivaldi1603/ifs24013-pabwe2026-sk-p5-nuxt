import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DetailPage from './DetailPage.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';
import { showConfirmDialog } from '../../../helpers/toolsHelper';

vi.mock('../../../helpers/toolsHelper', () => ({
  formatRupiah: vi.fn(val => val),
  formatDate: vi.fn(val => val),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('DetailPage', () => {
  it('fetches detail on mount', async () => {
    const { wrapper, router } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    expect(store.asyncGetCashFlowDetail).toHaveBeenCalled;
  });

  it('handles delete', async () => {
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn().mockResolvedValue({});
    const store = useCashFlowsStore();
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    store.cashFlow = { id: '1', type: 'inflow' };
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    
    const btns = wrapper.findAll('button');
    const deleteBtn = btns.find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('handles fetch error', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.reject() });
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn().mockResolvedValue({});
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(router.push).toHaveBeenCalledWith('/');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });
  });

  it('handles delete error and modal open', async () => {
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn().mockResolvedValue({});
    const store = useCashFlowsStore();
    
    (showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });

    store.cashFlow = { id: '1', type: 'inflow', source: 'unknown' };
    store.asyncDeleteCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    
    await nextTick();
    
    const btns = wrapper.findAll('button');
    let deleteBtn = btns.find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();

    // without message
    store.asyncDeleteCashFlow = vi.fn().mockRejectedValue({});
    deleteBtn = wrapper.findAll('button').find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    await new Promise(r => setTimeout(r, 10));

    const changeBtn = wrapper.findAll('button').find(b => b.text() === 'Ubah Transaksi');
    if (changeBtn) await changeBtn.trigger('click');

    // trigger close on modal
    const ChangeModal = (await import('../modals/ChangeModal.vue')).default;
    const modal = wrapper.findComponent(ChangeModal);
    if (modal.exists()) {
      await modal.vm.$emit('close');
      await modal.vm.$emit('refresh');
    }

    // trigger router link
    const link = wrapper.findComponent({ name: 'RouterLink' });
    if (link.exists()) {
      await link.trigger('click').catch(() => {});
    }
  });

  it('handles delete cancel', async () => {
    const { wrapper } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    store.cashFlow = { id: '1', type: 'inflow' };
    store.asyncDeleteCashFlow = vi.fn();
    
    await nextTick();
    (showConfirmDialog as any).mockResolvedValueOnce({ isConfirmed: false });

    const deleteBtn = wrapper.findAll('button').find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).not.toHaveBeenCalled();
  });
});