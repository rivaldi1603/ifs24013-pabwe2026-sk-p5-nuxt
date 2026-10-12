import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Lightweight stub routes for tests (same paths as src/routes.ts) so tests don't
// trigger lazy page imports after the test environment is torn down.
const Stub = { template: '<div />' };
export const testRoutes: RouteRecordRaw[] = [
  { path: '/auth', component: Stub, children: [
    { path: 'login', component: Stub },
    { path: 'register', component: Stub },
  ] },
  { path: '/', component: Stub, children: [
    { path: '', component: Stub },
    { path: 'cash-flows/:cashFlowId', component: Stub },
    { path: 'users', component: Stub },
    { path: 'profile', component: Stub },
  ] },
  { path: '/:pathMatch(.*)*', component: Stub },
];

export function createMockPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

export function renderWithProviders(component: any, options: any = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: testRoutes,
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