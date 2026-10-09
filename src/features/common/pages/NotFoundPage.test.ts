import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import NotFoundPage from './NotFoundPage.vue';

describe('NotFoundPage', () => {
  it('renders', async () => {
    const { wrapper } = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain('404');
    
    const link = wrapper.find('a');
    if (link.exists()) {
      await link.trigger('click');
    }
  });
});