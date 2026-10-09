<template>
  <nav aria-label="Navigasi Utama" class="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10 relative">
    <div class="flex items-center space-x-4 lg:hidden">
      <button @click="$emit('toggle-sidebar')" class="text-gray-500 hover:text-gray-700" aria-label="Buka menu">
        <MenuIcon class="w-6 h-6" aria-hidden="true" />
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
          :src="getAvatar(usersStore.me)"
          @error="onImgError($event, usersStore.me)"
          alt="Avatar" 
          width="40" height="40"
          loading="lazy" decoding="async"
          class="w-10 h-10 rounded-full object-cover bg-slate-100"
        />
      </div>
      <div v-else class="flex items-center space-x-3 animate-pulse">
        <div class="text-right hidden sm:block space-y-2">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
      <button @click="handleLogout" class="text-gray-500 hover:text-red-600 transition-colors" aria-label="Keluar">
        <LogOutIcon class="w-5 h-5" aria-hidden="true" />
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

const getFallbackUrl = (user: any) => {
  const name = encodeURIComponent(user?.name || user?.full_name || user?.username || 'User');
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

onMounted(() => {
  if (!usersStore.me) {
    usersStore.asyncGetMe();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
