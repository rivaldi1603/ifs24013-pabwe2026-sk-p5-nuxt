import { fetchApi } from "../../../helpers/apiHelper";

export async function getCashFlows(params: Record<string, string | number> = {}) {
  // Clean undefined/null params
  const cleanParams: Record<string, string> = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      cleanParams[key] = String(params[key]);
    }
  });
  
  const query = new URLSearchParams(cleanParams).toString();
  const url = query ? `/cash-flows?${query}` : "/cash-flows";
  return fetchApi(url);
}

export async function getCashFlowDetail(id: string) {
  return fetchApi(`/cash-flows/${id}`);
}

export async function addCashFlow(payload: Record<string, any>) {
  return fetchApi("/cash-flows", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateCashFlow(id: string, payload: Record<string, any>) {
  return fetchApi(`/cash-flows/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteCashFlow(id: string) {
  return fetchApi(`/cash-flows/${id}`, { method: "DELETE" });
}

export async function getCashFlowLabels() {
  return fetchApi("/cash-flows/labels");
}

export async function getDailyStats() {
  return fetchApi("/cash-flows/stats/daily");
}

export async function getMonthlyStats() {
  return fetchApi("/cash-flows/stats/monthly");
}

export async function deleteAllCashFlows() {
  return fetchApi("/cash-flows", { method: "DELETE" });
}
