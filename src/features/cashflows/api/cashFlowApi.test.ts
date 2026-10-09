import { describe, it, expect, vi } from 'vitest';
import { getCashFlows, getCashFlowDetail, addCashFlow, updateCashFlow, deleteCashFlow, getCashFlowLabels, getDailyStats, getMonthlyStats, deleteAllCashFlows } from './cashFlowApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('cashFlowApi', () => {
  it('getCashFlows works with and without params', async () => {
    await getCashFlows();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows');
    
    await getCashFlows({ type: 'inflow', empty: '', nulll: null as any });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows?type=inflow');
  });
  it('getCashFlowDetail works', async () => {
    await getCashFlowDetail('1');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1');
  });
  it('addCashFlow works', async () => {
    await addCashFlow({});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows', expect.any(Object));
  });
  it('updateCashFlow works', async () => {
    await updateCashFlow('1', {});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1', expect.any(Object));
  });
  it('deleteCashFlow works', async () => {
    await deleteCashFlow('1');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1', expect.any(Object));
  });
  it('getCashFlowLabels works', async () => {
    await getCashFlowLabels();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/labels');
  });
  it('getDailyStats works', async () => {
    await getDailyStats();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/stats/daily');
  });
  it('getMonthlyStats works', async () => {
    await getMonthlyStats();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/stats/monthly');
  });
  it('deleteAllCashFlows works', async () => {
    await deleteAllCashFlows();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows', expect.any(Object));
  });
});