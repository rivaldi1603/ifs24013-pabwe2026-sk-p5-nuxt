import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import App from './app.vue';

describe('App', () => {
  it('renders', () => {
    const { wrapper } = renderWithProviders(App);
    expect(wrapper.exists()).toBe(true);
  });
});