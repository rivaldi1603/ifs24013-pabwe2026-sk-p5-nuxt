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
    store.users = [
      { id: 1, name: 'John Doe', email: 'a@a.com', created_at: '2026-10-10', photo: 'http://test.com/a.jpg' },
      { id: 2, name: '', full_name: 'Jane Doe', email: 'b@b.com', created_at: '2026-10-10', avatar: 'invalid' },
      { id: 3, name: '', full_name: '', username: 'jim_doe', email: 'c@c.com', created_at: '2026-10-10' }, // no photo
      { id: 4, name: '', full_name: '', username: '', email: 'd@d.com', created_at: '2026-10-10' } // fallback 'Pengguna'
    ];
    store.isLoading = false;
    
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('John Doe');

    const imgs = wrapper.findAll('img');
    for (const img of imgs) {
      if (img.exists()) {
        await img.trigger('error');
      }
    }
  });
});