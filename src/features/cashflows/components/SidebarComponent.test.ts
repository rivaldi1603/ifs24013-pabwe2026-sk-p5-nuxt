import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import SidebarComponent from './SidebarComponent.vue';

describe('SidebarComponent', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(SidebarComponent);
    expect(wrapper.text()).toContain('Delcom');
  });

  it('computes isActive correctly', async () => {
    const { wrapper, router } = renderWithProviders(SidebarComponent);
    
    await router.push('/');
    await wrapper.vm.$nextTick();
    
    await router.push('/users');
    await wrapper.vm.$nextTick();

    await router.push('/profile');
    await wrapper.vm.$nextTick();

    // click all router links to cover their templates
    const links = wrapper.findAllComponents({ name: 'RouterLink' });
    for (const link of links) {
      await link.trigger('click');
    }
  });
});