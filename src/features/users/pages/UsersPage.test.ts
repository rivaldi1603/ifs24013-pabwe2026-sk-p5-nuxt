import { describe, it, expect } from 'vitest';
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
});