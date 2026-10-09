import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import NotFoundPage from './NotFoundPage.vue';

describe('NotFoundPage', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain('404');
  });
});