<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-900">Profil Saya</h1>
    
    <div v-if="usersStore.isLoading && !usersStore.me" class="text-center py-10">
      <p class="text-gray-500">Memuat profil...</p>
    </div>
    
    <div v-else-if="usersStore.me" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center">
        <img 
          :src="usersStore.me.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(usersStore.me.name)}`" 
          alt="Avatar" 
          class="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h2 class="text-xl font-medium text-gray-900">{{ usersStore.me.name }}</h2>
        <p class="text-gray-500 mb-4">{{ usersStore.me.email }}</p>
        
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
        <button 
          @click="fileInput?.click()" 
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          Ubah Foto
        </button>
      </div>

      <div class="md:col-span-2 bg-white shadow rounded-lg p-6">
        <form @submit.prevent="handleUpdateBio" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Informasi Dasar</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" v-model="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email (Tidak dapat diubah)</label>
            <input type="email" :value="usersStore.me.email" disabled class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm sm:text-sm" />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Simpan Perubahan</button>
          </div>
        </form>
        
        <form @submit.prevent="handleUpdatePassword" class="space-y-4 mt-8">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Ubah Kata Sandi</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
            <input type="password" v-model="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">Perbarui Kata Sandi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUsersStore } from '../states/usersStore';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { useInput } from '../../../hooks/useInput';

const usersStore = useUsersStore();
const fileInput = ref<HTMLInputElement | null>(null);

const [name, onNameInput] = useInput('');
const [password, onPasswordInput] = useInput('');

onMounted(async () => {
  await usersStore.asyncGetMe();
  if (usersStore.me) {
    name.value = usersStore.me.name;
  }
});

watch(() => usersStore.me, (newVal) => {
  if (newVal) name.value = newVal.name;
});

const handleUpdateBio = async () => {
  try {
    await usersStore.asyncUpdateBio({ name: name.value });
    showSuccessDialog("Berhasil", "Profil berhasil diperbarui.");
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal memperbarui profil.");
  }
};

const handleUpdatePassword = async () => {
  try {
    await usersStore.asyncUpdatePassword({ password: password.value });
    showSuccessDialog("Berhasil", "Kata sandi berhasil diperbarui.");
    password.value = '';
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal memperbarui kata sandi.");
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    try {
      await usersStore.asyncUploadAvatar(target.files[0]);
      showSuccessDialog("Berhasil", "Foto profil berhasil diperbarui.");
    } catch (err: any) {
      showErrorDialog("Gagal", err.message || "Gagal mengunggah foto.");
    }
  }
};
</script>
