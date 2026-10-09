import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCashFlowsStore } from './cashFlowsStore';
import * as cashFlowApi from '../api/cashFlowApi';

vi.mock('../api/cashFlowApi', () => ({
  getCashFlows: vi.fn(),
  getCashFlowDetail: vi.fn(),
  addCashFlow: vi.fn(),
  updateCashFlow: vi.fn(),
  deleteCashFlow: vi.fn(),
  getCashFlowLabels: vi.fn(),
  getDailyStats: vi.fn(),
  getMonthlyStats: vi.fn(),
  getStats: vi.fn(),
  deleteAllCashFlows: vi.fn(),
}));

describe('cashFlowsStore', () => {
  beforeEach(() => setActivePinia(createPinia()));
  
  it('asyncGetCashFlows works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlows as any).mockResolvedValue({ data: { items: [], summary: {} } });
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual([]);
    expect(store.stats).toEqual({});

    // test other branches
    (cashFlowApi.getCashFlows as any).mockResolvedValue({ data: { cash_flows: ['1'], summary: null } });
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual(['1']);

    (cashFlowApi.getCashFlows as any).mockResolvedValue({ data: ['2'], summary: {} });
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual(['2']);
    
    (cashFlowApi.getCashFlows as any).mockResolvedValue({ summary: {} });
    await store.asyncGetCashFlows();
  });
  it('asyncGetCashFlows handles missing data', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlows as any).mockResolvedValue(null);
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual([]);
  });

  it('asyncGetCashFlowDetail works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue({ data: { id: '1' } });
    await store.asyncGetCashFlowDetail('1');
    expect(store.cashFlow).toEqual({ id: '1' });
    
    // test other branches
    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue({ data: { cash_flow: { id: '2' } } });
    await store.asyncGetCashFlowDetail('2');
    expect(store.cashFlow).toEqual({ id: '2' });

    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue({ data: { item: { id: '3' } } });
    await store.asyncGetCashFlowDetail('3');
    expect(store.cashFlow).toEqual({ id: '3' });

    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue({ id: '4' });
    await store.asyncGetCashFlowDetail('4');
    expect(store.cashFlow).toEqual({ id: '4' });
    
    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue(null);
    await store.asyncGetCashFlowDetail('5');
    expect(store.cashFlow).toBeNull();
  });

  it('asyncAddCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.addCashFlow as any).mockResolvedValue('ok');
    await store.asyncAddCashFlow({});
    expect(store.isCashFlowAdded).toBe(true);
  });

  it('asyncUpdateCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.updateCashFlow as any).mockResolvedValue('ok');
    await store.asyncUpdateCashFlow('1', {});
    expect(store.isCashFlowChanged).toBe(true);
  });

  it('asyncDeleteCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteCashFlow as any).mockResolvedValue('ok');
    await store.asyncDeleteCashFlow('1');
    expect(store.isCashFlowDeleted).toBe(true);
  });

  it('asyncGetCashFlowLabels works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlowLabels as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetCashFlowLabels();
    expect(store.labels).toEqual(['a']);
    
    (cashFlowApi.getCashFlowLabels as any).mockResolvedValue(null);
    await store.asyncGetCashFlowLabels();
    expect(store.labels).toEqual([]);
  });

  it('asyncGetDailyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getDailyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetDailyStats();
    expect(store.dailyStats).toEqual(['a']);

    (cashFlowApi.getDailyStats as any).mockResolvedValue(null);
    await store.asyncGetDailyStats();
    expect(store.dailyStats).toEqual([]);
  });

  it('asyncGetMonthlyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getMonthlyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetMonthlyStats();
    expect(store.monthlyStats).toEqual(['a']);

    (cashFlowApi.getMonthlyStats as any).mockResolvedValue(null);
    await store.asyncGetMonthlyStats();
    expect(store.monthlyStats).toEqual([]);
  });



  it('asyncDeleteAllCashFlows works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteAllCashFlows as any).mockResolvedValue('ok');
    await store.asyncDeleteAllCashFlows();
    expect(store.isCashFlowDeletedAll).toBe(true);
  });

  // Error paths
  it('handles errors in asyncAddCashFlow', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.addCashFlow as any).mockRejectedValue(new Error('error'));
    await expect(store.asyncAddCashFlow({})).rejects.toThrow('error');
    expect(store.isCashFlowAdd).toBe(false);
  });

  it('handles errors in asyncUpdateCashFlow', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.updateCashFlow as any).mockRejectedValue(new Error('error'));
    await expect(store.asyncUpdateCashFlow('1', {})).rejects.toThrow('error');
    expect(store.isCashFlowChange).toBe(false);
  });

  it('handles errors in asyncDeleteCashFlow', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteCashFlow as any).mockRejectedValue(new Error('error'));
    await expect(store.asyncDeleteCashFlow('1')).rejects.toThrow('error');
    expect(store.isCashFlowDelete).toBe(false);
  });

  it('handles errors in asyncDeleteAllCashFlows', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteAllCashFlows as any).mockRejectedValue(new Error('error'));
    await expect(store.asyncDeleteAllCashFlows()).rejects.toThrow('error');
    expect(store.isCashFlowDeleteAll).toBe(false);
  });
});