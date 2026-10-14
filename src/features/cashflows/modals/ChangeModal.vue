<template>
  <CashFlowModal
    :is-open="isOpen"
    title="Ubah Pencatatan Arus Kas"
    submit-text="Simpan Perubahan"
    :is-submitting="cashFlowsStore.isCashFlowChange"
    :initial-data="cashFlowData"
    @close="emit('close')"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import CashFlowModal from './CashFlowModal.vue';

const props = defineProps<{ isOpen: boolean; cashFlowData: any }>();
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
    await cashFlowsStore.asyncUpdateCashFlow(props.cashFlowData?.id, formData);
    showSuccessDialog("Berhasil", "Data arus kas berhasil diperbarui");
    emit('refresh');
    emit('close');
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal memperbarui arus kas");
  }
};
</script>
