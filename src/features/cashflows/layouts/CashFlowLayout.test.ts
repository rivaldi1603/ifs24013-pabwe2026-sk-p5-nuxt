import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import CashFlowLayout from './CashFlowLayout.vue';

describe('CashFlowLayout', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(CashFlowLayout);
    expect(wrapper.find('main').exists()).toBe(true);
  });
});