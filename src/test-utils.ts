import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { routes } from './routes';

// Lightweight stub routes for tests (derived from src/routes.ts) so tests don't
// trigger lazy page imports after the test environment is torn down.
const Stub = { template: '<div />' };

function createStubRoutes(routeList: RouteRecordRaw[]): RouteRecordRaw[] {
  return routeList.map((r) => ({
    path: r.path,
    component: Stub,
    ...(r.children ? { children: createStubRoutes(r.children) } : {}),
  }));
}

export const testRoutes: RouteRecordRaw[] = createStubRoutes(routes);

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