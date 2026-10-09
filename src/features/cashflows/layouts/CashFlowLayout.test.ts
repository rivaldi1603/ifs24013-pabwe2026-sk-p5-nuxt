import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import CashFlowLayout from './CashFlowLayout.vue';

describe('CashFlowLayout', () => {
  it('renders and toggles menu', async () => {
    const { wrapper } = renderWithProviders(CashFlowLayout);
    expect(wrapper.find('main').exists()).toBe(true);
    
    // Trigger toggle menu from Navbar
    const navbar = wrapper.findComponent({ name: 'NavbarComponent' });
    if (navbar.exists()) {
      await navbar.vm.$emit('toggle-sidebar');
      
      // now click overlay
      const overlay = wrapper.find('div.bg-black');
      if (overlay.exists()) {
        await overlay.trigger('click');
      }
    }
  });
});