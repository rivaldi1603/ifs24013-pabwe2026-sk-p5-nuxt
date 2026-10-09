<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">Tambah Pencatatan Arus Kas</h3>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Jenis Arus Kas</label>
          <select v-model="type" required class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="inflow">Pemasukan (Inflow)</option>
            <option value="outflow">Pengeluaran (Outflow)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sumber Dana</label>
          <select v-model="source" required class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="cash">Tunai (Cash)</option>
            <option value="savings">Tabungan (Savings)</option>
            <option value="loans">Pinjaman (Loans)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Label/Kategori</label>
          <input type="text" v-model="label" required placeholder="Contoh: Gaji, Makanan" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nominal (Rupiah)</label>
          <input type="number" v-model.number="nominal" required min="1" placeholder="50000" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Deskripsi/Keterangan</label>
          <textarea v-model="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" @click="close" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="submit" :disabled="cashFlowsStore.isCashFlowAdd" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'refresh']);

const cashFlowsStore = useCashFlowsStore();

const type = ref('inflow');
const source = ref('cash');
const label = ref('');
const nominal = ref<number | null>(null);
const description = ref('');

const close = () => {
  emit('close');
};

const handleSubmit = async () => {
  try {
    await cashFlowsStore.asyncAddCashFlow({
      type: type.value,
      source: source.value,
      label: label.value,
      nominal: nominal.value,
      description: description.value
    });
    showSuccessDialog("Berhasil", "Data arus kas berhasil ditambahkan");
    emit('refresh');
    close();
    
    type.value = 'inflow';
    source.value = 'cash';
    label.value = '';
    nominal.value = null;
    description.value = '';
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal menambahkan arus kas");
  }
};
</script>
