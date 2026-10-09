<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-900">Profil Saya</h1>
    
    <div v-if="usersStore.isLoading && !usersStore.me" class="text-center py-10">
      <p class="text-gray-500">Memuat profil...</p>
    </div>
    
    <div v-else-if="usersStore.me" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center">
        <img 
          :src="getAvatar(usersStore.me)" 
          @error="onImgError($event, usersStore.me)"
          alt="Avatar" 
          class="w-32 h-32 rounded-full object-cover mb-4 shadow-sm bg-slate-100"
        />
        <h2 class="text-xl font-medium text-gray-900">{{ usersStore.me.name || usersStore.me.full_name || usersStore.me.username || 'Pengguna' }}</h2>
        <p class="text-gray-500 mb-4">{{ usersStore.me.email }}</p>
        
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
        <button 
          @click="fileInput?.click()" 
          :disabled="isUploadingAvatar"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center space-x-2"
        >
          <Loader2Icon v-if="isUploadingAvatar" class="w-4 h-4 animate-spin" />
          <span>{{ isUploadingAvatar ? 'Mengunggah...' : 'Ubah Foto' }}</span>
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
            <button type="submit" :disabled="isUpdatingBio" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2">
              <Loader2Icon v-if="isUpdatingBio" class="w-4 h-4 animate-spin" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
        
        <form @submit.prevent="handleUpdatePassword" class="space-y-4 mt-8">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Ubah Kata Sandi</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
            <div class="relative mt-1">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Masukkan kata sandi baru" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10" required />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
            
            <div v-if="password" class="mt-2">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-gray-500">Kekuatan Sandi</span>
                <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="passwordStrengthBg" :style="{ width: passwordStrengthPercent + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" :disabled="isUpdatingPassword" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2">
              <Loader2Icon v-if="isUpdatingPassword" class="w-4 h-4 animate-spin" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useUsersStore } from '../states/usersStore';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { useInput } from '../../../hooks/useInput';
import { Eye as EyeIcon, EyeOff as EyeOffIcon, Loader2 as Loader2Icon } from 'lucide-vue-next';

const usersStore = useUsersStore();
const fileInput = ref<HTMLInputElement | null>(null);

const [name, onNameInput] = useInput('');
const [password, onPasswordInput] = useInput('');
const showPassword = ref(false);

const isUpdatingBio = ref(false);
const isUpdatingPassword = ref(false);
const isUploadingAvatar = ref(false);

const passwordStrengthPercent = computed(() => {
  if (!password.value) return 0;
  let score = 0;
  if (password.value.length > 5) score += 25;
  if (password.value.length > 8) score += 25;
  if (/[A-Z]/.test(password.value)) score += 25;
  if (/[0-9!@#\$%\^\&*\)\(+=._-]/.test(password.value)) score += 25;
  return score;
});

const passwordStrengthColor = computed(() => {
  const score = passwordStrengthPercent.value;
  if (score <= 25) return 'text-red-500';
  if (score <= 50) return 'text-amber-500';
  if (score <= 75) return 'text-blue-500';
  return 'text-emerald-500';
});

const passwordStrengthText = computed(() => {
  const score = passwordStrengthPercent.value;
  if (score <= 25) return 'Sangat Lemah';
  if (score <= 50) return 'Lemah';
  if (score <= 75) return 'Sedang';
  return 'Kuat';
});

const passwordStrengthBg = computed(() => {
  const score = passwordStrengthPercent.value;
  if (score <= 25) return 'bg-red-500';
  if (score <= 50) return 'bg-amber-500';
  if (score <= 75) return 'bg-blue-500';
  return 'bg-emerald-500';
});

const getFallbackUrl = (user: any) => {
  const name = encodeURIComponent(user.name || user.full_name || user.username || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};

const getAvatar = (user: any) => {
  if (!user) return '';
  let url = user.photo || user.avatar || user.avatar_url;
  if (!url || !url.startsWith('http')) return getFallbackUrl(user);
  return url;
};

const onImgError = (event: Event, user: any) => {
  const target = event.target as HTMLImageElement;
  target.src = getFallbackUrl(user);
};

onMounted(async () => {
  await usersStore.asyncGetMe();
  if (usersStore.me) {
    name.value = usersStore.me.name || usersStore.me.full_name || usersStore.me.username || '';
  }
});

watch(() => usersStore.me, (newVal) => {
  if (newVal) name.value = newVal.name || newVal.full_name || newVal.username || '';
});

const handleUpdateBio = async () => {
  isUpdatingBio.value = true;
  try {
    await usersStore.asyncUpdateBio({ name: name.value });
    showSuccessDialog("Berhasil", "Profil berhasil diperbarui.");
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal memperbarui profil.");
  } finally {
    isUpdatingBio.value = false;
  }
};

const handleUpdatePassword = async () => {
  isUpdatingPassword.value = true;
  try {
    await usersStore.asyncUpdatePassword({ password: password.value });
    showSuccessDialog("Berhasil", "Kata sandi berhasil diperbarui.");
    password.value = '';
  } catch (err: any) {
    showErrorDialog("Gagal", err.message || "Gagal memperbarui kata sandi.");
  } finally {
    isUpdatingPassword.value = false;
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    isUploadingAvatar.value = true;
    try {
      await usersStore.asyncUploadAvatar(target.files[0]);
      showSuccessDialog("Berhasil", "Foto profil berhasil diperbarui.");
    } catch (err: any) {
      showErrorDialog("Gagal", err.message || "Gagal mengunggah foto.");
    } finally {
      isUploadingAvatar.value = false;
    }
  }
};
</script>
