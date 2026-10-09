import { defineStore } from "pinia";
import { 
  getCashFlows, 
  getCashFlowDetail, 
  addCashFlow, 
  updateCashFlow, 
  deleteCashFlow, 
  getCashFlowLabels, 
  getDailyStats, 
  getMonthlyStats, 
  deleteAllCashFlows 
} from "../api/cashFlowApi";

export interface CashFlow {
  id: string;
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  nominal: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CashFlowStats {
  total_inflow: number;
  total_outflow: number;
  cash: number;
  savings: number;
  loans: number;
}

export interface CashFlowQueryParams {
  type?: string;
  source?: string;
  label?: string;
  start_date?: string;
  end_date?: string;
}

export interface CashFlowsState {
  cashFlows: CashFlow[];
  cashFlow: CashFlow | null;
  stats: CashFlowStats | null;
  labels: string[];
  dailyStats: any[];
  monthlyStats: any[];
  isCashFlowAdd: boolean;
  isCashFlowAdded: boolean;
  isCashFlowChange: boolean;
  isCashFlowChanged: boolean;
  isCashFlowDelete: boolean;
  isCashFlowDeleted: boolean;
  isCashFlowDeleteAll: boolean;
  isCashFlowDeletedAll: boolean;
}

export const useCashFlowsStore = defineStore("cashFlows", {
  state: (): CashFlowsState => ({
    cashFlows: [],
    cashFlow: null,
    stats: null,
    labels: [],
    dailyStats: [],
    monthlyStats: [],
    isCashFlowAdd: false,
    isCashFlowAdded: false,
    isCashFlowChange: false,
    isCashFlowChanged: false,
    isCashFlowDelete: false,
    isCashFlowDeleted: false,
    isCashFlowDeleteAll: false,
    isCashFlowDeletedAll: false,
  }),
  actions: {
    async asyncGetCashFlows(params?: CashFlowQueryParams) {
      const response = await getCashFlows(params as Record<string, string>);
      this.cashFlows = response?.data?.cash_flows || response?.data?.items || response?.data || [];
      this.stats = response?.data?.summary || response?.summary || null;
      return response;
    },
    async asyncGetCashFlowDetail(id: string) {
      const response = await getCashFlowDetail(id);
      this.cashFlow = response?.data?.cash_flow || response?.data?.item || response?.data || response || null;
      return response;
    },
    async asyncAddCashFlow(payload: Record<string, any>) {
      this.isCashFlowAdd = true;
      this.isCashFlowAdded = false;
      try {
        const response = await addCashFlow(payload);
        this.isCashFlowAdded = true;
        return response;
      } finally {
        this.isCashFlowAdd = false;
      }
    },
    async asyncUpdateCashFlow(id: string, payload: Record<string, any>) {
      this.isCashFlowChange = true;
      this.isCashFlowChanged = false;
      try {
        const response = await updateCashFlow(id, payload);
        this.isCashFlowChanged = true;
        return response;
      } finally {
        this.isCashFlowChange = false;
      }
    },
    async asyncDeleteCashFlow(id: string) {
      this.isCashFlowDelete = true;
      this.isCashFlowDeleted = false;
      try {
        const response = await deleteCashFlow(id);
        this.isCashFlowDeleted = true;
        return response;
      } finally {
        this.isCashFlowDelete = false;
      }
    },
    async asyncGetCashFlowLabels() {
      const response = await getCashFlowLabels();
      this.labels = response?.data || [];
      return response;
    },
    async asyncGetDailyStats() {
      const response = await getDailyStats();
      this.dailyStats = response?.data || [];
      return response;
    },
    async asyncGetMonthlyStats() {
      const response = await getMonthlyStats();
      this.monthlyStats = response?.data || [];
      return response;
    },
    async asyncDeleteAllCashFlows() {
      this.isCashFlowDeleteAll = true;
      this.isCashFlowDeletedAll = false;
      try {
        const response = await deleteAllCashFlows();
        this.isCashFlowDeletedAll = true;
        return response;
      } finally {
        this.isCashFlowDeleteAll = false;
      }
    }
  }
});
