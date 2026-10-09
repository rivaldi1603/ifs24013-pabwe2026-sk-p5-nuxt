import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAccessToken, putAccessToken, removeAccessToken, fetchApi } from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global as any).DELCOM_BASEURL = 'https://mock-api.com';
  });

  it('manages token in localStorage', () => {
    putAccessToken('test-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-token');
    
    getAccessToken();
    expect(window.localStorage.getItem).toHaveBeenCalledWith('accessToken');
    
    removeAccessToken();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });

  describe('fetchApi', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('fetches with token and application/json successfully', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue('mock-token');
      const mockResponse = { data: 'ok' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const res = await fetchApi('/test');
      expect(res).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[0]).toBe('https://mock-api.com/test');
      expect(callArgs[1].headers.get('Authorization')).toBe('Bearer mock-token');
      expect(callArgs[1].headers.get('Content-Type')).toBe('application/json');
    });

    it('fetches with FormData (no content type)', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      const mockResponse = { data: 'ok' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const fd = new FormData();
      await fetchApi('/test-fd', { body: fd });
      
      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[1].headers.get('Authorization')).toBeNull();
      expect(callArgs[1].headers.get('Content-Type')).toBeNull();
    });

    it('throws error on failure', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Error from API' })
      });
      
      await expect(fetchApi('/error')).rejects.toThrow('Error from API');
    });

    it('throws error with status text if no message', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.reject()
      });
      
      await expect(fetchApi('/error2')).rejects.toThrow('Not Found');
    });

    it('throws generic error if nothing else', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject()
      });
      
      await expect(fetchApi('/error3')).rejects.toThrow('Terjadi kesalahan pada server');
    });
  });
});