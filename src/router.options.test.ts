import { describe, it, expect } from 'vitest';
import routerOptions from './router.options';

describe('router.options', () => {
  it('returns routes array', () => {
    const routes = routerOptions.routes!({} as any);
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });
});