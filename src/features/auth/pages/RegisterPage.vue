<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div>
      <label for="register-name-input" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
      <div class="mt-1 relative rounded-lg shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserIcon class="h-5 w-5 text-slate-400" />
        </div>
        <input 
          id="register-name-input" 
          type="text" 
          v-model="name" 
          @input="onNameInput"
          required 
          class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="John Doe"
        />
      </div>
    </div>

    <div>
      <label for="register-email-input" class="block text-sm font-medium text-slate-700">Email</label>
      <div class="mt-1 relative rounded-lg shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MailIcon class="h-5 w-5 text-slate-400" />
        </div>
        <input 
          id="register-email-input" 
          type="email" 
          v-model="email" 
          @input="onEmailInput"
          required 
          class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="nama@email.com"
        />
      </div>
    </div>

    <div>
      <label for="register-password-input" class="block text-sm font-medium text-slate-700">Password</label>
      <div class="mt-1 relative rounded-lg shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockIcon class="h-5 w-5 text-slate-400" />
        </div>
        <input 
          id="register-password-input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="password" 
          @input="onPasswordInput"
          required 
          class="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="••••••••"
        />
        <button type="button" :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <EyeIcon v-if="!showPassword" class="h-5 w-5" aria-hidden="true" />
          <EyeOffIcon v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <button 
      id="register-submit-button"
      type="submit" 
      :disabled="authStore.isRegister"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-2"
    >
      <Loader2Icon v-if="authStore.isRegister" class="w-4 h-4 animate-spin" />
      <span>{{ authStore.isRegister ? 'Memuat...' : 'Daftar' }}</span>
    </button>

    <div class="text-center text-sm">
      <span class="text-slate-500">Sudah punya akun?</span>
      <router-link to="/auth/login" class="ml-1 font-medium text-blue-600 hover:text-blue-500">Masuk di sini</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../states/authStore';
import { useInput } from '../../../hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { User as UserIcon, Mail as MailIcon, Lock as LockIcon, Eye as EyeIcon, EyeOff as EyeOffIcon, Loader2 as Loader2Icon } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const [name, onNameInput] = useInput('');
const [email, onEmailInput] = useInput('');
const [password, onPasswordInput] = useInput('');
const showPassword = ref(false);

const handleRegister = async () => {
  try {
    const payload = {
      name: name.value,
      email: email.value,
      password: password.value
    };
    
    await authStore.asyncRegister(payload);
    await showSuccessDialog('Berhasil', 'Registrasi berhasil. Silakan masuk.');
    router.push('/auth/login');
  } catch (error: any) {
    showErrorDialog('Gagal', error.message || 'Terjadi kesalahan saat mendaftar.');
  }
};
</script>
