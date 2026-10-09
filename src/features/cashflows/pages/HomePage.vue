<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-semibold text-gray-900">Ringkasan Arus Kas</h1>
      <div class="flex space-x-2">
        <button @click="isAddModalOpen = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          + Tambah Transaksi
        </button>
        <button @click="handleResetAll" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
          Reset Semua
        </button>
      </div>
    </div>

    <!-- Cards Stats -->
    <div v-if="cashFlowsStore.stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Total Saldo Kas Bersih</p>
        <p class="text-2xl font-bold text-slate-900">{{ formatRupiah(cashFlowsStore.stats.total_inflow - cashFlowsStore.stats.total_outflow) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Total Pemasukan (Inflow)</p>
        <p class="text-2xl font-bold text-emerald-600">{{ formatRupiah(cashFlowsStore.stats.total_inflow) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Total Pengeluaran (Outflow)</p>
        <p class="text-2xl font-bold text-red-600">{{ formatRupiah(cashFlowsStore.stats.total_outflow) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Saldo Kas Tunai</p>
        <p class="text-xl font-bold text-slate-800">{{ formatRupiah(cashFlowsStore.stats.cash) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Saldo Tabungan</p>
        <p class="text-xl font-bold text-slate-800">{{ formatRupiah(cashFlowsStore.stats.savings) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p class="text-sm font-medium text-slate-500 mb-1">Saldo Pinjaman</p>
        <p class="text-xl font-bold text-amber-600">{{ formatRupiah(cashFlowsStore.stats.loans) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Jenis</label>
        <select v-model="filters.type" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option value="">Semua</option>
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Sumber</label>
        <select v-model="filters.source" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option value="">Semua</option>
          <option value="cash">Tunai</option>
          <option value="savings">Tabungan</option>
          <option value="loans">Pinjaman</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Mulai Tanggal</label>
        <input type="date" v-model="filters.start_date" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Sampai Tanggal</label>
        <input type="date" v-model="filters.end_date" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>
      <div class="flex items-end">
        <button @click="resetFilters" class="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors">
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Jenis & Label</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sumber</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nominal</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="cf in cashFlowsStore.cashFlows" :key="cf.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ formatDate(cf.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span :class="cf.type === 'inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ cf.type === 'inflow' ? 'Inflow' : 'Outflow' }}
                  </span>
                  <span class="text-sm text-slate-900 font-medium">{{ cf.label }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 uppercase">{{ cf.source }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="cf.type === 'inflow' ? 'text-emerald-600' : 'text-red-600'">
                {{ cf.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(cf.nominal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <router-link :to="`/cash-flows/${cf.id}`" class="text-blue-600 hover:text-blue-900">Detail</router-link>
                <button @click="openChangeModal(cf)" class="text-amber-600 hover:text-amber-900">Ubah</button>
                <button @click="handleDelete(cf.id)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
            <tr v-if="cashFlowsStore.cashFlows.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                Tidak ada data arus kas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AddModal :is-open="isAddModalOpen" @close="isAddModalOpen = false" @refresh="fetchData" />
    <ChangeModal :is-open="isChangeModalOpen" :cash-flow-data="selectedCashFlow" @close="isChangeModalOpen = false" @refresh="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import AddModal from '../modals/AddModal.vue';
import ChangeModal from '../modals/ChangeModal.vue';

const cashFlowsStore = useCashFlowsStore();

const isAddModalOpen = ref(false);
const isChangeModalOpen = ref(false);
const selectedCashFlow = ref(null);

const filters = reactive({
  type: '',
  source: '',
  start_date: '',
  end_date: ''
});

const fetchData = async () => {
  await cashFlowsStore.asyncGetCashFlows(filters);
};

onMounted(() => {
  fetchData();
});

const resetFilters = () => {
  filters.type = '';
  filters.source = '';
  filters.start_date = '';
  filters.end_date = '';
  fetchData();
};

const openChangeModal = (cf: any) => {
  selectedCashFlow.value = cf;
  isChangeModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  const confirm = await showConfirmDialog("Hapus Transaksi?", "Transaksi ini akan dihapus secara permanen.");
  if (confirm.isConfirmed) {
    try {
      await cashFlowsStore.asyncDeleteCashFlow(id);
      showSuccessDialog("Berhasil", "Data berhasil dihapus.");
      fetchData();
    } catch (err: any) {
      showErrorDialog("Gagal", err.message || "Gagal menghapus data.");
    }
  }
};

const handleResetAll = async () => {
  const confirm = await showConfirmDialog("Reset Seluruh Transaksi?", "Seluruh data transaksi Anda akan dihapus permanen!");
  if (confirm.isConfirmed) {
    try {
      await cashFlowsStore.asyncDeleteAllCashFlows();
      showSuccessDialog("Berhasil", "Seluruh data berhasil dihapus.");
      fetchData();
    } catch (err: any) {
      showErrorDialog("Gagal", err.message || "Gagal mereset data.");
    }
  }
};
</script>
