<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
      <input 
        id="name" 
        type="text" 
        v-model="name" 
        @input="onNameInput"
        required 
        class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="John Doe"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
      <input 
        id="email" 
        type="email" 
        v-model="email" 
        @input="onEmailInput"
        required 
        class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="nama@email.com"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
      <input 
        id="password" 
        type="password" 
        v-model="password" 
        @input="onPasswordInput"
        required 
        class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="••••••••"
      />
    </div>

    <button 
      type="submit" 
      :disabled="authStore.isRegister"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <span v-if="authStore.isRegister">Memuat...</span>
      <span v-else>Daftar</span>
    </button>

    <div class="text-center text-sm">
      <span class="text-slate-500">Sudah punya akun?</span>
      <router-link to="/auth/login" class="ml-1 font-medium text-blue-600 hover:text-blue-500">Masuk di sini</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../states/authStore';
import { useInput } from '../../../hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

const router = useRouter();
const authStore = useAuthStore();

const [name, onNameInput] = useInput('');
const [email, onEmailInput] = useInput('');
const [password, onPasswordInput] = useInput('');

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
