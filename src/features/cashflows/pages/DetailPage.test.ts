import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DetailPage from './DetailPage.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

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
    router.push = vi.fn();
    const store = useCashFlowsStore();
    store.cashFlow = { id: '1', type: 'inflow' };
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    
    const btns = wrapper.findAll('button');
    const deleteBtn = btns.find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('handles fetch error', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.reject() });
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn();
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(router.push).toHaveBeenCalledWith('/');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });
  });
});