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

  it('handles load more logic', async () => {
    const { wrapper } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    
    // create 25 users to trigger pagination
    store.users = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i}`,
      email: `user${i}@a.com`,
      created_at: '2026-10-10'
    }));
    store.isLoading = false;
    
    await wrapper.vm.$nextTick();
    
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(20); // PAGE_SIZE

    const btn = wrapper.find('button');
    expect(btn.exists()).toBe(true);
    await btn.trigger('click');

    const rowsAfter = wrapper.findAll('tbody tr');
    expect(rowsAfter.length).toBe(25);
  });
});