<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center space-x-4">
      <router-link to="/" class="text-slate-500 hover:text-blue-600 transition-colors">
        &larr; Kembali
      </router-link>
      <h1 class="text-2xl font-semibold text-gray-900">Rincian Transaksi</h1>
    </div>

    <div v-if="!cashFlowsStore.cashFlow" class="text-center py-10">
      <p class="text-slate-500">Memuat data rincian...</p>
    </div>

    <div v-else class="bg-white shadow rounded-xl overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <span :class="cashFlowsStore.cashFlow.type === 'inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wider">
            {{ cashFlowsStore.cashFlow.type === 'inflow' ? 'Pemasukan (Inflow)' : 'Pengeluaran (Outflow)' }}
          </span>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold" :class="cashFlowsStore.cashFlow.type === 'inflow' ? 'text-emerald-600' : 'text-red-600'">
            {{ cashFlowsStore.cashFlow.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(cashFlowsStore.cashFlow.nominal) }}
          </p>
        </div>
      </div>
      <div class="p-6">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <dt class="text-sm font-medium text-slate-500">Label Kategori</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">{{ cashFlowsStore.cashFlow.label }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Sumber Dana</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900 uppercase">{{ cashFlowsStore.cashFlow.source }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-slate-500">Deskripsi Catatan</dt>
            <dd class="mt-1 text-base text-slate-700 whitespace-pre-wrap">{{ cashFlowsStore.cashFlow.description || '-' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Tanggal Dibuat</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDate(cashFlowsStore.cashFlow.created_at) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Terakhir Diperbarui</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDate(cashFlowsStore.cashFlow.updated_at) }}</dd>
          </div>
        </dl>
      </div>
      <div class="bg-slate-50 px-6 py-4 flex justify-end space-x-3 border-t border-slate-100">
        <button @click="openChangeModal" class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-amber-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">Ubah Transaksi</button>
        <button @click="handleDelete" class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">Hapus Transaksi</button>
      </div>
    </div>

    <ChangeModal 
      :is-open="isChangeModalOpen" 
      :cash-flow-data="cashFlowsStore.cashFlow" 
      @close="isChangeModalOpen = false" 
      @refresh="fetchDetail" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import ChangeModal from '../modals/ChangeModal.vue';

const route = useRoute();
const router = useRouter();
const cashFlowsStore = useCashFlowsStore();

const isChangeModalOpen = ref(false);
const id = route.params.cashFlowId as string;

const fetchDetail = async () => {
  try {
    await cashFlowsStore.asyncGetCashFlowDetail(id);
  } catch (err) {
    router.push('/');
  }
};

onMounted(() => {
  fetchDetail();
});

const openChangeModal = () => {
  isChangeModalOpen.value = true;
};

const handleDelete = async () => {
  const confirm = await showConfirmDialog("Hapus Transaksi?", "Transaksi ini akan dihapus secara permanen.");
  if (confirm.isConfirmed) {
    try {
      await cashFlowsStore.asyncDeleteCashFlow(id);
      showSuccessDialog("Berhasil", "Data berhasil dihapus.");
      router.push('/');
    } catch (err: any) {
      showErrorDialog("Gagal", err.message || "Gagal menghapus data.");
    }
  }
};
</script>
