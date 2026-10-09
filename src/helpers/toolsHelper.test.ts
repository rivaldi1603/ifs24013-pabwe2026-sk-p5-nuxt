import { describe, it, expect, vi } from 'vitest';
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatRupiah, formatDate } from './toolsHelper';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}));

describe('toolsHelper', () => {
  it('showSuccessDialog calls Swal.fire', async () => {
    await showSuccessDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
  });
  
  it('showErrorDialog calls Swal.fire', async () => {
    await showErrorDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
  });
  
  it('showConfirmDialog calls Swal.fire', async () => {
    await showConfirmDialog('Title', 'Text');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'warning' }));
  });
  
  it('formatRupiah formats correctly', () => {
    const formatted = formatRupiah(100000);
    // Node 18+ Intl replaces standard space with non-breaking space
    expect(formatted.replace(/\s|\u00A0/g, '')).toContain('Rp100.000');
  });

  it('formatDate formats correctly', () => {
    const d = new Date('2026-10-10T10:00:00Z');
    const formatted = formatDate(d.toISOString());
    expect(typeof formatted).toBe('string');
  });

  it('formatDate handles empty', () => {
    expect(formatDate('')).toBe('-');
  });

  it('formatDate handles invalid', () => {
    expect(formatDate('invalid')).toBe('-');
  });
});