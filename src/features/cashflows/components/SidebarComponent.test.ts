import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import SidebarComponent from './SidebarComponent.vue';

describe('SidebarComponent', () => {
  it('renders correctly', () => {
    const { wrapper } = renderWithProviders(SidebarComponent);
    expect(wrapper.text()).toContain('Delcom');
  });
});