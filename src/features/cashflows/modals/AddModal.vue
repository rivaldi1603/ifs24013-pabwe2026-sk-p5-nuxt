<template>
  <CashFlowModal
    :is-open="isOpen"
    title="Tambah Pencatatan Arus Kas"
    submit-text="Simpan"
    :is-submitting="cashFlowsStore.isCashFlowAdd"
    @close="emit('close')"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import CashFlowModal from './CashFlowModal.vue';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'refresh']);

const cashFlowsStore = useCashFlowsStore();

const handleSubmit = async (formData: {
  type: string;
  source: string;
  label: string;
  nominal: number | null;
  description: string;
}) => {
  try {
    await cashFlowsStore.asyncAddCashFlow(formData);
    showSuccessDialog("Berhasil", "Data arus kas berhasil ditambahkan");
    emit('refresh');
    emit('close');
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal menambahkan arus kas");
  }
};
</script>
