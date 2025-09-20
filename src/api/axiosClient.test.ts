import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { createApiClient } from './axiosClient';

type MockAxiosInstance = {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  interceptors: {
    request: {
      use: ReturnType<typeof vi.fn>;
    };
  };
};

// Mock axios
vi.mock('axios', () => {
  const instance: MockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
  };

  (globalThis as unknown as { mockAxiosInstance: MockAxiosInstance }).mockAxiosInstance = instance;

  return {
    default: {
      create: vi.fn(() => instance),
    },
  };
});

const mockedAxios = vi.mocked(axios);
const mockAxiosInstance = (globalThis as unknown as { mockAxiosInstance: MockAxiosInstance }).mockAxiosInstance;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch for getStream
const fetchMock = vi.fn();
(globalThis as { fetch: typeof fetch }).fetch = fetchMock;

describe('createApiClient', () => {
  let apiClient: ReturnType<typeof createApiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_URL', '/');
    localStorageMock.getItem.mockReturnValue(null);
    apiClient = createApiClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('get method', () => {
    it('should make a GET request and return data', async () => {
      const mockData = { message: 'success' };
      const mockResponse = { data: mockData };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test');

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { Accept: 'application/json' },
        })
      );
    });

    it('should handle GET request errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('post method', () => {
    it('should make a POST request and return data', async () => {
      const mockData = { id: 1, name: 'test' };
      const mockResponse = { data: mockData };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test', { name: 'test' });

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', { name: 'test' }, undefined);
    });

    it('should handle POST request errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(apiClient.post('/test', { name: 'test' })).rejects.toThrow('Network error');
    });
  });

  describe('patch method', () => {
    it('should make a PATCH request and return data', async () => {
      const mockData = { id: 1, name: 'updated' };
      const mockResponse = { data: mockData };
      mockAxiosInstance.patch.mockResolvedValue(mockResponse);

      const result = await apiClient.patch('/test/1', { name: 'updated' });

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test/1', { name: 'updated' }, undefined);
    });

    it('should return undefined if no data in response', async () => {
      const mockResponse = { data: null };
      mockAxiosInstance.patch.mockResolvedValue(mockResponse);

      const result = await apiClient.patch('/test/1', { name: 'updated' });

      expect(result).toBeUndefined();
    });

    it('should handle PATCH request errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.patch.mockRejectedValue(mockError);

      await expect(apiClient.patch('/test/1', { name: 'updated' })).rejects.toThrow('Network error');
    });
  });

  describe('postFormData method', () => {
    it('should make a POST request with FormData', async () => {
      const mockData = { success: true };
      const mockResponse = { data: mockData };
      const formData = new FormData();
      formData.append('file', new Blob(['test'], { type: 'text/plain' }));

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.postFormData('/upload', formData);

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/upload', formData, expect.objectContaining({
        headers: expect.any(Object),
      }));
    });

    it('should handle postFormData request errors', async () => {
      const mockError = new Error('Network error');
      const formData = new FormData();

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(apiClient.postFormData('/upload', formData)).rejects.toThrow('Network error');
    });
  });

  describe('del method', () => {
    it('should make a DELETE request', async () => {
      mockAxiosInstance.delete.mockResolvedValue({});

      await expect(apiClient.del('/test/1')).resolves.toBeUndefined();
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
    });

    it('should handle DELETE request errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(apiClient.del('/test/1')).rejects.toThrow('Network error');
    });
  });

  describe('getStream method', () => {
    it('should handle streaming response', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: () => ({
            read: vi.fn()
              .mockResolvedValueOnce({ value: new TextEncoder().encode('{"data":"chunk1"}\n'), done: false })
              .mockResolvedValueOnce({ value: new TextEncoder().encode('{"data":"chunk2"}\n'), done: false })
              .mockResolvedValueOnce({ done: true }),
          }),
        },
        headers: new Headers(),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const onChunk = vi.fn();
      await apiClient.getStream('/stream', onChunk);

      expect(onChunk).toHaveBeenCalledWith({ data: 'chunk1' });
      expect(onChunk).toHaveBeenCalledWith({ data: 'chunk2' });
    });

    it('should handle stream errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue('Internal Server Error'),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const onChunk = vi.fn();
      await expect(apiClient.getStream('/stream', onChunk)).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Authentication', () => {
    it('should add Authorization header when token exists', async () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      // Recreate client to apply new localStorage
      apiClient = createApiClient();

      const callback = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const req = { headers: { set: vi.fn() } };
      callback(req);

      expect(req.headers.set).toHaveBeenCalledWith('Authorization', 'Bearer test-token');
    });

    it('should not add Authorization header when no token', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      apiClient = createApiClient();

      const callback = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const req = { headers: { set: vi.fn() } };
      callback(req);

      expect(req.headers.set).not.toHaveBeenCalled();
    });
  });
});
