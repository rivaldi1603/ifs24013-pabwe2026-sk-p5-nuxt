<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Direktori Pengguna</h1>
    </div>
    
    <div v-if="usersStore.isLoading" class="text-center py-10">
      <p class="text-gray-500">Memuat data pengguna...</p>
    </div>
    
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terdaftar Pada</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in visibleUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img class="h-10 w-10 rounded-full object-cover bg-slate-100" loading="lazy" decoding="async" :src="getAvatar(user)" @error="onImgError($event, user)" alt="" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name || user.full_name || user.username || 'Pengguna' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="flex justify-center mt-6" v-if="hasMore && !usersStore.isLoading">
      <button type="button" @click="showMore" class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
        Muat lebih banyak
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useUsersStore } from '../states/usersStore';
import { formatDate } from '../../../helpers/toolsHelper';

const usersStore = useUsersStore();
const PAGE_SIZE = 20;
const visibleCount = ref(PAGE_SIZE);

const visibleUsers = computed(() => usersStore.users.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < usersStore.users.length);

const showMore = () => {
  visibleCount.value += PAGE_SIZE;
};

const getFallbackUrl = (user: any) => {
  const name = encodeURIComponent(user.name || user.full_name || user.username || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};

const getAvatar = (user: any) => {
  let url = user.photo || user.avatar || user.avatar_url;
  if (!url || !url.startsWith('http')) return getFallbackUrl(user);
  return url;
};

const onImgError = (event: Event, user: any) => {
  const target = event.target as HTMLImageElement;
  target.src = getFallbackUrl(user);
};

onMounted(async () => {
  await usersStore.asyncGetUsers();
});
</script>
