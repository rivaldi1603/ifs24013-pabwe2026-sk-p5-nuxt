<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-semibold text-gray-900">Ringkasan Arus Kas</h1>
      <div class="flex space-x-2">
        <button @click="isAddModalOpen = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          + Tambah Transaksi
        </button>
        <button @click="handleResetAll" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
          Reset Semua
        </button>
      </div>
    </div>

    <!-- Cards Stats -->
    <div v-if="cashFlowsStore.stats" class="space-y-4">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl shadow-md text-white flex items-center justify-between">
        <div>
          <p class="text-blue-100 font-medium mb-1">Total Saldo Kas Bersih</p>
          <p class="text-3xl sm:text-4xl font-bold">{{ formatRupiah(cashFlowsStore.stats.total_inflow - cashFlowsStore.stats.total_outflow) }}</p>
        </div>
        <div class="bg-blue-500/30 p-4 rounded-full hidden sm:block">
          <WalletIcon class="w-10 h-10 text-blue-50" />
        </div>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="bg-emerald-100 p-3 rounded-xl">
            <TrendingUpIcon class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Pemasukan (Inflow)</p>
            <p class="text-xl font-bold text-emerald-600">{{ formatRupiah(cashFlowsStore.stats.total_inflow) }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="bg-red-100 p-3 rounded-xl">
            <TrendingDownIcon class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Pengeluaran (Outflow)</p>
            <p class="text-xl font-bold text-red-600">{{ formatRupiah(cashFlowsStore.stats.total_outflow) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="bg-slate-100 p-3 rounded-xl">
            <BanknoteIcon class="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Saldo Tunai</p>
            <p class="text-lg font-bold text-slate-800">{{ formatRupiah(cashFlowsStore.stats.cash) }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="bg-blue-50 p-3 rounded-xl">
            <PiggyBankIcon class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Saldo Tabungan</p>
            <p class="text-lg font-bold text-slate-800">{{ formatRupiah(cashFlowsStore.stats.savings) }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="bg-amber-50 p-3 rounded-xl">
            <CreditCardIcon class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Saldo Pinjaman</p>
            <p class="text-lg font-bold text-slate-800">{{ formatRupiah(cashFlowsStore.stats.loans) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
      <div>
        <label for="filter-label" class="block text-xs font-medium text-slate-700 mb-1">Cari Label</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <SearchIcon class="h-4 w-4 text-slate-400" />
          </div>
          <input id="filter-label" type="text" v-model="filters.label" @input="fetchData" placeholder="Gaji, dll..." class="block w-full pl-8 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label for="filter-type" class="block text-xs font-medium text-slate-700 mb-1">Jenis</label>
        <select id="filter-type" v-model="filters.type" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option value="">Semua</option>
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>
      </div>
      <div>
        <label for="filter-source" class="block text-xs font-medium text-slate-700 mb-1">Sumber</label>
        <select id="filter-source" v-model="filters.source" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option value="">Semua</option>
          <option value="cash">Tunai</option>
          <option value="savings">Tabungan</option>
          <option value="loans">Pinjaman</option>
        </select>
      </div>
      <div>
        <label for="filter-start" class="block text-xs font-medium text-slate-700 mb-1">Mulai Tanggal</label>
        <input id="filter-start" type="date" v-model="filters.start_date" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>
      <div>
        <label for="filter-end" class="block text-xs font-medium text-slate-700 mb-1">Sampai Tanggal</label>
        <input id="filter-end" type="date" v-model="filters.end_date" @change="fetchData" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{{ sourceLabel(cf.source) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" :class="cf.type === 'inflow' ? 'text-emerald-600' : 'text-red-600'">
                {{ cf.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(cf.nominal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                <router-link :to="`/cash-flows/${cf.id}`" class="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail" aria-label="Detail">
                  <EyeIcon class="w-4 h-4" aria-hidden="true" />
                </router-link>
                <button @click="openChangeModal(cf)" class="inline-flex p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Ubah" aria-label="Ubah transaksi">
                  <PencilIcon class="w-4 h-4" aria-hidden="true" />
                </button>
                <button @click="handleDelete(cf.id)" class="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus" aria-label="Hapus transaksi">
                  <Trash2Icon class="w-4 h-4" aria-hidden="true" />
                </button>
              </td>
            </tr>
            <tr v-if="cashFlowsStore.cashFlows.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="bg-slate-100 p-4 rounded-full mb-4">
                    <ReceiptIcon class="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 class="text-lg font-medium text-slate-900 mb-1">Belum ada transaksi</h3>
                  <p class="text-slate-500 mb-4">Catat pemasukan atau pengeluaran pertamamu hari ini.</p>
                  <button @click="isAddModalOpen = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    + Tambah Transaksi
                  </button>
                </div>
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
import { 
  Eye as EyeIcon, 
  Pencil as PencilIcon, 
  Trash2 as Trash2Icon, 
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Banknote as BanknoteIcon,
  PiggyBank as PiggyBankIcon,
  CreditCard as CreditCardIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon
} from 'lucide-vue-next';

const cashFlowsStore = useCashFlowsStore();

const isAddModalOpen = ref(false);
const isChangeModalOpen = ref(false);
const selectedCashFlow = ref(null);

const filters = reactive({
  label: '',
  type: '',
  source: '',
  start_date: '',
  end_date: ''
});

const sourceLabel = (src: string) => {
  const map: Record<string, string> = { cash: 'Tunai', savings: 'Tabungan', loans: 'Pinjaman' };
  return map[src] || src;
};

const fetchData = async () => {
  await cashFlowsStore.asyncGetCashFlows(filters);
};

onMounted(() => {
  fetchData();
});

const resetFilters = () => {
  filters.label = '';
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
      let msg = "Gagal menghapus data.";
      /* v8 ignore next 3 */
      if (err.message) {
        msg = err.message;
      }
      showErrorDialog("Gagal", msg);
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
