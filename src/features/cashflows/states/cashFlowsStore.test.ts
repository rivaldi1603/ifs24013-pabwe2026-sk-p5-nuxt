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
  });

  it('asyncGetDailyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getDailyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetDailyStats();
    expect(store.dailyStats).toEqual(['a']);
  });

  it('asyncGetMonthlyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getMonthlyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetMonthlyStats();
    expect(store.monthlyStats).toEqual(['a']);
  });

  it('asyncDeleteAllCashFlows works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteAllCashFlows as any).mockResolvedValue('ok');
    await store.asyncDeleteAllCashFlows();
    expect(store.isCashFlowDeletedAll).toBe(true);
  });
});