import { describe, it, expect } from 'vitest';
import { useInput } from './useInput';

describe('useInput', () => {
  it('works correctly', () => {
    const [value, onInput] = useInput('initial');
    expect(value.value).toBe('initial');
    
    onInput({ target: { value: 'changed' } } as any);
    expect(value.value).toBe('changed');
  });
});