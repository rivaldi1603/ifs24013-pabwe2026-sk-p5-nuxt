<template>
  <aside class="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
    <div class="p-6 flex items-center space-x-3">
      <img :src="'/logo.svg'" alt="Logo" class="w-8 h-8 drop-shadow" />
      <div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Delcom</h2>
        <p class="text-xs text-slate-400 mt-1">Cash Flow App</p>
      </div>
    </div>
    <nav class="flex-1 px-4 space-y-2 mt-4">
      <router-link 
        to="/" 
        class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200"
        :class="isActive('/') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
      >
        <LayoutDashboardIcon class="w-5 h-5" />
        <span class="font-medium">Ringkasan</span>
      </router-link>
      
      <router-link 
        to="/users" 
        class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200"
        :class="isActive('/users') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
      >
        <UsersIcon class="w-5 h-5" />
        <span class="font-medium">Direktori Pengguna</span>
      </router-link>
      
      <router-link 
        to="/profile" 
        class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200"
        :class="isActive('/profile') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
      >
        <UserCircleIcon class="w-5 h-5" />
        <span class="font-medium">Profil Saya</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  LayoutDashboard as LayoutDashboardIcon, 
  Users as UsersIcon, 
  UserCircle as UserCircleIcon 
} from 'lucide-vue-next';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>
