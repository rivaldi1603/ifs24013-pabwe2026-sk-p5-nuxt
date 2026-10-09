<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-8 flex flex-col items-center">
          <img :src="'/logo.svg'" alt="Logo" class="w-16 h-16 mb-4 drop-shadow-md" />
          <h1 class="text-2xl font-bold text-slate-900">Delcom Cash Flow</h1>
          <p class="text-slate-500 mt-2">Kelola keuangan Anda dengan mudah</p>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
