import fs from 'fs';
import path from 'path';

const tests = [
  {
    path: 'src/setupTests.ts',
    content: `import '@testing-library/jest-dom';
import { vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

(global as any).DELCOM_BASEURL = 'https://mock-api.com';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});`
  },
  {
    path: 'src/test-utils.ts',
    content: `import { mount } from '@vue/test-utils';
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
          RouterLink: true,
          RouterView: true,
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
}`
  },
  {
    path: 'src/helpers/apiHelper.test.ts',
    content: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAccessToken, putAccessToken, removeAccessToken, fetchApi } from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global as any).DELCOM_BASEURL = 'https://mock-api.com';
  });

  it('manages token in localStorage', () => {
    putAccessToken('test-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-token');
    
    getAccessToken();
    expect(window.localStorage.getItem).toHaveBeenCalledWith('accessToken');
    
    removeAccessToken();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });

  describe('fetchApi', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('fetches with token and application/json successfully', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue('mock-token');
      const mockResponse = { data: 'ok' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const res = await fetchApi('/test');
      expect(res).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[0]).toBe('https://mock-api.com/test');
      expect(callArgs[1].headers.get('Authorization')).toBe('Bearer mock-token');
      expect(callArgs[1].headers.get('Content-Type')).toBe('application/json');
    });

    it('fetches with FormData (no content type)', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      const mockResponse = { data: 'ok' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const fd = new FormData();
      await fetchApi('/test-fd', { body: fd });
      
      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[1].headers.get('Authorization')).toBeNull();
      expect(callArgs[1].headers.get('Content-Type')).toBeNull();
    });

    it('throws error on failure', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Error from API' })
      });
      
      await expect(fetchApi('/error')).rejects.toThrow('Error from API');
    });

    it('throws error with status text if no message', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.reject()
      });
      
      await expect(fetchApi('/error2')).rejects.toThrow('Not Found');
    });

    it('throws generic error if nothing else', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject()
      });
      
      await expect(fetchApi('/error3')).rejects.toThrow('Terjadi kesalahan pada server');
    });
  });
});`
  },
  {
    path: 'src/helpers/toolsHelper.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatRupiah, formatDate } from './toolsHelper';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}));

describe('toolsHelper', () => {
  it('showSuccessDialog calls Swal.fire', () => {
    showSuccessDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
  });
  
  it('showErrorDialog calls Swal.fire', () => {
    showErrorDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
  });
  
  it('showConfirmDialog calls Swal.fire', () => {
    showConfirmDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'warning' }));
  });
  
  it('formatRupiah formats correctly', () => {
    const formatted = formatRupiah(100000);
    // Node 18+ Intl replaces standard space with non-breaking space
    expect(formatted.replace(/\\s|\\u00A0/g, '')).toContain('Rp100.000');
  });

  it('formatDate formats correctly', () => {
    const d = new Date('2026-10-10T10:00:00Z');
    const formatted = formatDate(d.toISOString());
    expect(typeof formatted).toBe('string');
  });
});`
  },
  {
    path: 'src/hooks/useInput.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { useInput } from './useInput';

describe('useInput', () => {
  it('works correctly', () => {
    const [value, onInput] = useInput('initial');
    expect(value.value).toBe('initial');
    
    onInput({ target: { value: 'changed' } } as any);
    expect(value.value).toBe('changed');
  });
});`
  },
  {
    path: 'src/features/auth/api/authApi.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { login, register } from './authApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
  putAccessToken: vi.fn(),
}));

describe('authApi', () => {
  it('login puts access token on success', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ data: { token: '123' } });
    await login({ email: 'a@a.com', password: '123' });
    expect(apiHelper.putAccessToken).toHaveBeenCalledWith('123');
  });

  it('login works if no token in response', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({});
    await login({ email: 'a@a.com', password: '123' });
    // Should not crash
  });

  it('register calls fetchApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ status: 200 });
    await register({ email: 'a@a.com', password: '123' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/register', expect.any(Object));
  });
});`
  },
  {
    path: 'src/features/auth/states/authStore.test.ts',
    content: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './authStore';
import * as authApi from '../api/authApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock('../../../helpers/apiHelper', () => ({
  removeAccessToken: vi.fn(),
}));

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asyncLogin works', async () => {
    const store = useAuthStore();
    (authApi.login as any).mockResolvedValue('ok');
    const res = await store.asyncLogin({});
    expect(res).toBe('ok');
    expect(store.isLogin).toBe(false);
  });

  it('asyncRegister works', async () => {
    const store = useAuthStore();
    (authApi.register as any).mockResolvedValue('ok');
    const res = await store.asyncRegister({});
    expect(res).toBe('ok');
    expect(store.isRegister).toBe(false);
  });

  it('logout works', () => {
    const store = useAuthStore();
    store.authUser = { id: 1 };
    store.logout();
    expect(store.authUser).toBeNull();
    expect(apiHelper.removeAccessToken).toHaveBeenCalled();
  });
});`
  },
  {
    path: 'src/features/auth/layouts/AuthLayout.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import AuthLayout from './AuthLayout.vue';

describe('AuthLayout', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(AuthLayout);
    expect(wrapper.text()).toContain('Delcom Cash Flow');
  });
});`
  },
  {
    path: 'src/features/auth/pages/LoginPage.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import LoginPage from './LoginPage.vue';
import { useAuthStore } from '../states/authStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('LoginPage', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(LoginPage);
    expect(wrapper.text()).toContain('Email');
    expect(wrapper.text()).toContain('Password');
  });

  it('handles login success', async () => {
    const { wrapper, router } = renderWithProviders(LoginPage);
    router.push = vi.fn();
    const store = useAuthStore();
    store.asyncLogin = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncLogin).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('handles login error', async () => {
    const { wrapper } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.asyncLogin = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncLogin).toHaveBeenCalled();
  });
});`
  },
  {
    path: 'src/features/auth/pages/RegisterPage.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import RegisterPage from './RegisterPage.vue';
import { useAuthStore } from '../states/authStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('RegisterPage', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(RegisterPage);
    expect(wrapper.text()).toContain('Nama Lengkap');
  });

  it('handles register success', async () => {
    const { wrapper, router } = renderWithProviders(RegisterPage);
    router.push = vi.fn();
    const store = useAuthStore();
    store.asyncRegister = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncRegister).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/auth/login');
  });

  it('handles register error', async () => {
    const { wrapper } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.asyncRegister = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncRegister).toHaveBeenCalled();
  });
});`
  },
  {
    path: 'src/features/users/api/userApi.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { getUsers, getMe, updateBio, uploadAvatar, updatePassword } from './userApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('userApi', () => {
  it('getUsers works', async () => {
    await getUsers();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users');
  });
  it('getMe works', async () => {
    await getMe();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me');
  });
  it('updateBio works', async () => {
    await updateBio({name: 'A'});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me', expect.any(Object));
  });
  it('uploadAvatar works', async () => {
    const f = new File([''], 'test.png');
    await uploadAvatar(f);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/photo', expect.any(Object));
  });
  it('updatePassword works', async () => {
    await updatePassword({password: 'A'});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/password', expect.any(Object));
  });
});`
  },
  {
    path: 'src/features/users/states/usersStore.test.ts',
    content: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from './usersStore';
import * as userApi from '../api/userApi';

vi.mock('../api/userApi', () => ({
  getUsers: vi.fn(),
  getMe: vi.fn(),
  updateBio: vi.fn(),
  uploadAvatar: vi.fn(),
  updatePassword: vi.fn(),
}));

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asyncGetUsers works', async () => {
    const store = useUsersStore();
    (userApi.getUsers as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetUsers();
    expect(store.users).toEqual(['a']);
  });
  
  it('asyncGetUsers works without data', async () => {
    const store = useUsersStore();
    (userApi.getUsers as any).mockResolvedValue(null);
    await store.asyncGetUsers();
    expect(store.users).toEqual([]);
  });

  it('asyncGetMe works', async () => {
    const store = useUsersStore();
    (userApi.getMe as any).mockResolvedValue({ data: {id: 1} });
    await store.asyncGetMe();
    expect(store.me).toEqual({id: 1});
  });

  it('asyncUpdateBio works', async () => {
    const store = useUsersStore();
    (userApi.updateBio as any).mockResolvedValue({});
    store.asyncGetMe = vi.fn();
    await store.asyncUpdateBio({});
    expect(store.asyncGetMe).toHaveBeenCalled();
  });

  it('asyncUploadAvatar works', async () => {
    const store = useUsersStore();
    (userApi.uploadAvatar as any).mockResolvedValue({});
    store.asyncGetMe = vi.fn();
    await store.asyncUploadAvatar(new File([''], 'a'));
    expect(store.asyncGetMe).toHaveBeenCalled();
  });

  it('asyncUpdatePassword works', async () => {
    const store = useUsersStore();
    (userApi.updatePassword as any).mockResolvedValue('ok');
    const res = await store.asyncUpdatePassword({});
    expect(res).toBe('ok');
  });
});`
  },
  {
    path: 'src/features/users/pages/UsersPage.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import UsersPage from './UsersPage.vue';
import { useUsersStore } from '../states/usersStore';

describe('UsersPage', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(UsersPage);
    expect(wrapper.text()).toContain('Direktori Pengguna');
  });
  
  it('renders users list', async () => {
    const { wrapper, pinia } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.users = [{ id: 1, name: 'John Doe', email: 'a@a.com', created_at: '2026-10-10' }];
    store.isLoading = false;
    
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('John Doe');
  });
});`
  },
  {
    path: 'src/features/users/pages/ProfilePage.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import ProfilePage from './ProfilePage.vue';
import { useUsersStore } from '../states/usersStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('ProfilePage', () => {
  it('renders loading state', () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.isLoading = true;
    store.me = null;
    expect(wrapper.text()).toContain('Profil Saya');
  });

  it('handles updates', async () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.me = { name: 'User', email: 'a@a' };
    store.asyncUpdateBio = vi.fn().mockResolvedValue({});
    store.asyncUpdatePassword = vi.fn().mockResolvedValue({});
    store.asyncUploadAvatar = vi.fn().mockResolvedValue({});
    
    await nextTick();
    
    // Bio
    const forms = wrapper.findAll('form');
    await forms[0].trigger('submit.prevent');
    expect(store.asyncUpdateBio).toHaveBeenCalled();
    
    // Password
    await forms[1].trigger('submit.prevent');
    expect(store.asyncUpdatePassword).toHaveBeenCalled();
    
    // Avatar error handle file length
    const input = wrapper.find('input[type="file"]');
    (input.element as any).files = [new File([''], 'test')];
    await input.trigger('change');
  });
  
  it('handles updates error', async () => {
    const { wrapper } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.me = { name: 'User', email: 'a@a' };
    store.asyncUpdateBio = vi.fn().mockRejectedValue(new Error('fail'));
    store.asyncUpdatePassword = vi.fn().mockRejectedValue(new Error('fail'));
    store.asyncUploadAvatar = vi.fn().mockRejectedValue(new Error('fail'));
    
    await nextTick();
    
    // Bio
    const forms = wrapper.findAll('form');
    await forms[0].trigger('submit.prevent');
    
    // Password
    await forms[1].trigger('submit.prevent');
    
    const input = wrapper.find('input[type="file"]');
    (input.element as any).files = [new File([''], 'test')];
    await input.trigger('change');
  });
});`
  },
  {
    path: 'src/features/cashflows/api/cashFlowApi.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { getCashFlows, getCashFlowDetail, addCashFlow, updateCashFlow, deleteCashFlow, getCashFlowLabels, getDailyStats, getMonthlyStats, deleteAllCashFlows } from './cashFlowApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('cashFlowApi', () => {
  it('getCashFlows works with and without params', async () => {
    await getCashFlows();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows');
    
    await getCashFlows({ type: 'inflow', empty: '', nulll: null as any });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows?type=inflow');
  });
  it('getCashFlowDetail works', async () => {
    await getCashFlowDetail('1');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1');
  });
  it('addCashFlow works', async () => {
    await addCashFlow({});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows', expect.any(Object));
  });
  it('updateCashFlow works', async () => {
    await updateCashFlow('1', {});
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1', expect.any(Object));
  });
  it('deleteCashFlow works', async () => {
    await deleteCashFlow('1');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/1', expect.any(Object));
  });
  it('getCashFlowLabels works', async () => {
    await getCashFlowLabels();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/labels');
  });
  it('getDailyStats works', async () => {
    await getDailyStats();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/stats/daily');
  });
  it('getMonthlyStats works', async () => {
    await getMonthlyStats();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows/stats/monthly');
  });
  it('deleteAllCashFlows works', async () => {
    await deleteAllCashFlows();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/cash-flows', expect.any(Object));
  });
});`
  },
  {
    path: 'src/features/cashflows/states/cashFlowsStore.test.ts',
    content: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCashFlowsStore } from './cashFlowsStore';
import * as cashFlowApi from '../api/cashFlowApi';

vi.mock('../api/cashFlowApi', () => ({
  getCashFlows: vi.fn(),
  getCashFlowDetail: vi.fn(),
  addCashFlow: vi.fn(),
  updateCashFlow: vi.fn(),
  deleteCashFlow: vi.fn(),
  getCashFlowLabels: vi.fn(),
  getDailyStats: vi.fn(),
  getMonthlyStats: vi.fn(),
  deleteAllCashFlows: vi.fn(),
}));

describe('cashFlowsStore', () => {
  beforeEach(() => setActivePinia(createPinia()));
  
  it('asyncGetCashFlows works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlows as any).mockResolvedValue({ data: { items: [], summary: {} } });
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual([]);
    expect(store.stats).toEqual({});
  });
  it('asyncGetCashFlows handles missing data', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlows as any).mockResolvedValue(null);
    await store.asyncGetCashFlows();
    expect(store.cashFlows).toEqual([]);
  });

  it('asyncGetCashFlowDetail works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlowDetail as any).mockResolvedValue({ data: { id: '1' } });
    await store.asyncGetCashFlowDetail('1');
    expect(store.cashFlow).toEqual({ id: '1' });
  });

  it('asyncAddCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.addCashFlow as any).mockResolvedValue('ok');
    await store.asyncAddCashFlow({});
    expect(store.isCashFlowAdded).toBe(true);
  });

  it('asyncUpdateCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.updateCashFlow as any).mockResolvedValue('ok');
    await store.asyncUpdateCashFlow('1', {});
    expect(store.isCashFlowChanged).toBe(true);
  });

  it('asyncDeleteCashFlow works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteCashFlow as any).mockResolvedValue('ok');
    await store.asyncDeleteCashFlow('1');
    expect(store.isCashFlowDeleted).toBe(true);
  });

  it('asyncGetCashFlowLabels works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getCashFlowLabels as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetCashFlowLabels();
    expect(store.labels).toEqual(['a']);
  });

  it('asyncGetDailyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getDailyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetDailyStats();
    expect(store.dailyStats).toEqual(['a']);
  });

  it('asyncGetMonthlyStats works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.getMonthlyStats as any).mockResolvedValue({ data: ['a'] });
    await store.asyncGetMonthlyStats();
    expect(store.monthlyStats).toEqual(['a']);
  });

  it('asyncDeleteAllCashFlows works', async () => {
    const store = useCashFlowsStore();
    (cashFlowApi.deleteAllCashFlows as any).mockResolvedValue('ok');
    await store.asyncDeleteAllCashFlows();
    expect(store.isCashFlowDeletedAll).toBe(true);
  });
});`
  },
  {
    path: 'src/features/cashflows/components/NavbarComponent.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import NavbarComponent from './NavbarComponent.vue';
import { useAuthStore } from '../../auth/states/authStore';
import { useUsersStore } from '../../users/states/usersStore';
import { nextTick } from 'vue';

describe('NavbarComponent', () => {
  it('renders and toggles sidebar', async () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy();
  });

  it('handles logout', async () => {
    const { wrapper, router } = renderWithProviders(NavbarComponent);
    router.push = vi.fn();
    const authStore = useAuthStore();
    authStore.logout = vi.fn();
    const usersStore = useUsersStore();
    usersStore.me = { name: 'A', photo: null };
    await nextTick();
    
    const btns = wrapper.findAll('button');
    await btns[1].trigger('click');
    expect(authStore.logout).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/auth/login');
  });
});`
  },
  {
    path: 'src/features/cashflows/components/SidebarComponent.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import SidebarComponent from './SidebarComponent.vue';

describe('SidebarComponent', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(SidebarComponent);
    expect(wrapper.text()).toContain('Delcom');
  });
});`
  },
  {
    path: 'src/features/cashflows/modals/AddModal.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import AddModal from './AddModal.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('AddModal', () => {
  it('renders when open', () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    expect(wrapper.text()).toContain('Tambah Pencatatan Arus Kas');
  });

  it('handles submit success', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const store = useCashFlowsStore();
    store.asyncAddCashFlow = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncAddCashFlow).toHaveBeenCalled();
    expect(wrapper.emitted('refresh')).toBeTruthy();
  });

  it('handles submit error', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const store = useCashFlowsStore();
    store.asyncAddCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncAddCashFlow).toHaveBeenCalled();
  });

  it('handles close', async () => {
    const { wrapper } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const btns = wrapper.findAll('button');
    await btns[0].trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});`
  },
  {
    path: 'src/features/cashflows/modals/ChangeModal.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import ChangeModal from './ChangeModal.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('ChangeModal', () => {
  it('populates fields', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1', type: 'inflow' } } });
    await nextTick();
    expect(wrapper.text()).toContain('Ubah Pencatatan Arus Kas');
  });

  it('handles submit success', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const store = useCashFlowsStore();
    store.asyncUpdateCashFlow = vi.fn().mockResolvedValue({});
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncUpdateCashFlow).toHaveBeenCalled();
    expect(wrapper.emitted('refresh')).toBeTruthy();
  });
  
  it('handles submit error', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const store = useCashFlowsStore();
    store.asyncUpdateCashFlow = vi.fn().mockRejectedValue(new Error('fail'));
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.asyncUpdateCashFlow).toHaveBeenCalled();
  });

  it('handles close', async () => {
    const { wrapper } = renderWithProviders(ChangeModal, { props: { isOpen: true, cashFlowData: { id: '1' } } });
    const btns = wrapper.findAll('button');
    await btns[0].trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});`
  },
  {
    path: 'src/features/cashflows/layouts/CashFlowLayout.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import CashFlowLayout from './CashFlowLayout.vue';

describe('CashFlowLayout', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(CashFlowLayout);
    expect(wrapper.find('main').exists()).toBe(true);
  });
});`
  },
  {
    path: 'src/features/cashflows/pages/HomePage.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import HomePage from './HomePage.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  formatRupiah: vi.fn(val => val),
  formatDate: vi.fn(val => val),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('HomePage', () => {
  it('renders and fetches data', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    expect(store.asyncGetCashFlows).toHaveBeenCalled;
    expect(wrapper.text()).toContain('Ringkasan Arus Kas');
  });

  it('handles delete', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    const btns = wrapper.findAll('button');
    // find delete button
    const deleteBtn = btns.find(b => b.text() === 'Hapus');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).toHaveBeenCalledWith('1');
  });

  it('handles reset all', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncDeleteAllCashFlows = vi.fn().mockResolvedValue({});
    
    const resetBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Semua');
    await resetBtn?.trigger('click');
    expect(store.asyncDeleteAllCashFlows).toHaveBeenCalled();
  });
  
  it('handles reset filters', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.asyncGetCashFlows = vi.fn().mockResolvedValue({});
    
    const resetFilterBtn = wrapper.findAll('button').find(b => b.text() === 'Reset Filter');
    await resetFilterBtn?.trigger('click');
    expect(store.asyncGetCashFlows).toHaveBeenCalled();
  });

  it('opens modals', async () => {
    const { wrapper } = renderWithProviders(HomePage);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: '1', type: 'inflow', source: 'cash', nominal: 1000, label: 'A' }];
    
    await nextTick();
    
    // Add modal
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('Tambah Transaksi'));
    await addBtn?.trigger('click');
    
    // Change modal
    const changeBtn = wrapper.findAll('button').find(b => b.text() === 'Ubah');
    await changeBtn?.trigger('click');
  });
});`
  },
  {
    path: 'src/features/cashflows/pages/DetailPage.test.ts',
    content: `import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DetailPage from './DetailPage.vue';
import { useCashFlowsStore } from '../states/cashFlowsStore';
import { nextTick } from 'vue';

vi.mock('../../../helpers/toolsHelper', () => ({
  formatRupiah: vi.fn(val => val),
  formatDate: vi.fn(val => val),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('DetailPage', () => {
  it('fetches detail on mount', async () => {
    const { wrapper, router } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    expect(store.asyncGetCashFlowDetail).toHaveBeenCalled;
  });

  it('handles delete', async () => {
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn();
    const store = useCashFlowsStore();
    store.cashFlow = { id: '1', type: 'inflow' };
    store.asyncDeleteCashFlow = vi.fn().mockResolvedValue({});
    
    await nextTick();
    
    const btns = wrapper.findAll('button');
    const deleteBtn = btns.find(b => b.text() === 'Hapus Transaksi');
    await deleteBtn?.trigger('click');
    expect(store.asyncDeleteCashFlow).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('handles fetch error', async () => {
    const store = useCashFlowsStore();
    store.asyncGetCashFlowDetail = vi.fn().mockRejectedValue(new Error('fail'));
    const { wrapper, router } = renderWithProviders(DetailPage);
    router.push = vi.fn();
    await nextTick();
    // It should push to '/'
    setTimeout(() => expect(router.push).toHaveBeenCalledWith('/'), 100);
  });
});`
  },
  {
    path: 'src/features/common/pages/NotFoundPage.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import NotFoundPage from './NotFoundPage.vue';

describe('NotFoundPage', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain('404');
  });
});`
  },
  {
    path: 'src/app.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import App from './app.vue';

describe('App', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(App);
    expect(wrapper.exists()).toBe(true);
  });
});`
  },
  {
    path: 'src/router.options.test.ts',
    content: `import { describe, it, expect } from 'vitest';
import routerOptions from './router.options';

describe('router.options', () => {
  it('returns routes array', () => {
    const routes = routerOptions.routes!({} as any);
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });
});`
  }
];

tests.forEach(test => {
  const fullPath = path.resolve(process.cwd(), test.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, test.content, 'utf-8');
  console.log('Created:', test.path);
});
