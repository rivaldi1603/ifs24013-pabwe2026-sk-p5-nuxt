<template>
  <nav class="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10 relative">
    <div class="flex items-center space-x-4 lg:hidden">
      <button @click="$emit('toggle-sidebar')" class="text-gray-500 hover:text-gray-700">
        <MenuIcon class="w-6 h-6" />
      </button>
      <div class="flex items-center space-x-2">
        <img :src="'/logo.svg'" alt="Logo" class="w-6 h-6" />
        <h1 class="text-xl font-bold text-gray-900">Delcom</h1>
      </div>
    </div>
    <div class="hidden lg:flex items-center space-x-3 text-xl font-bold text-gray-900">
      <img :src="'/logo.svg'" alt="Logo" class="w-7 h-7" />
      <span>Delcom Cash Flow</span>
    </div>
    
    <div class="flex items-center space-x-4">
      <div v-if="usersStore.me" class="flex items-center space-x-3">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-gray-900">{{ usersStore.me.name || usersStore.me.full_name || usersStore.me.username || 'Pengguna' }}</p>
          <p class="text-xs text-gray-500">{{ usersStore.me.email }}</p>
        </div>
        <img 
          :src="usersStore.me.photo || usersStore.me.avatar || usersStore.me.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(usersStore.me.name || usersStore.me.full_name || usersStore.me.username || 'User')}`" 
          alt="Avatar" 
          class="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <button @click="handleLogout" class="text-gray-500 hover:text-red-600 transition-colors">
        <LogOutIcon class="w-5 h-5" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/states/authStore';
import { useUsersStore } from '../../users/states/usersStore';
import { LogOut as LogOutIcon, Menu as MenuIcon } from 'lucide-vue-next';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

onMounted(async () => {
  if (!usersStore.me) {
    await usersStore.asyncGetMe();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
