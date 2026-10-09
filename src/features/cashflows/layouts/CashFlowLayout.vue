<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
    <div 
      :class="[
        'fixed inset-0 z-20 lg:static lg:block transition-opacity duration-300',
        isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0 lg:opacity-100 lg:block'
      ]"
    >
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 lg:hidden"></div>
      <SidebarComponent class="relative z-30 lg:h-screen" />
    </div>
    
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
      <NavbarComponent @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="flex-1 overflow-y-auto p-6 scroll-smooth">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavbarComponent from '../components/NavbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';

const isSidebarOpen = ref(false);
</script>
