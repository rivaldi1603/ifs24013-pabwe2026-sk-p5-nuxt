import { describe, it, expect } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import { routes } from './routes';

const collect = (list: RouteRecordRaw[]): RouteRecordRaw[] =>
  list.flatMap((r) => [r, ...collect((r.children as RouteRecordRaw[]) || [])]);

describe('routes', () => {
  it('lazy-loads every route component', async () => {
    const all = collect(routes);
    expect(all.length).toBe(9);
    for (const r of all) {
      expect(typeof r.component).toBe('function');
      const mod: any = await (r.component as () => Promise<any>)();
      expect(mod.default).toBeTruthy();
    }
  });
});
