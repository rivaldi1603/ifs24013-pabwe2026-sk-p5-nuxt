import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { routes } from './routes';

export function createMockPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

export function renderWithProviders(component: any, options: any = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });
  const pinia = createMockPinia();
  
  return {
    wrapper: mount(component, {
      global: {
        plugins: [pinia, router],
        stubs: {
          NuxtPage: true,
          ...options.global?.stubs
        },
        ...options.global,
      },
      ...options,
    }),
    router,
    pinia,
  };
}