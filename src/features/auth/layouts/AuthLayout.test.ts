import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import AuthLayout from './AuthLayout.vue';

describe('AuthLayout', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(AuthLayout);
    expect(wrapper.text()).toContain('Delcom Cash Flow');
  });
});