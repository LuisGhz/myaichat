import { apiClient } from 'api/fetch.api';
import { AuthService } from 'services/auth/auth.service';

export const createAuthenticatedApiClient = () => {
  const getAuthHeaders = (): Record<string, string> => {
    const token = AuthService.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const get = async <T>(path: string, options?: RequestInit): Promise<T | undefined> => {
    const authHeaders = getAuthHeaders();
    return apiClient.get<T>(path, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string>),
      },
    });
  };

  const post = async <T>(
    path: string,
    data?: object,
    options?: RequestInit
  ): Promise<T | undefined> => {
    const authHeaders = getAuthHeaders();
    return apiClient.post<T, RequestInit>(path, data, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string>),
      },
    });
  };

  const postFormData = async <T>(
    path: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T | undefined> => {
    const authHeaders = getAuthHeaders();
    return apiClient.postFormData<T, RequestInit>(path, formData, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string>),
      },
    });
  };

  const del = async (path: string, options?: RequestInit): Promise<void> => {
    const authHeaders = getAuthHeaders();
    return apiClient.del<RequestInit>(path, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string>),
      },
    });
  };

  const patch = async <T>(
    path: string,
    data?: object,
    options?: RequestInit
  ): Promise<T | undefined> => {
    const authHeaders = getAuthHeaders();
    return apiClient.patch<T, RequestInit>(path, data, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string>),
      },
    });
  };

  return {
    get,
    post,
    postFormData,
    del,
    patch,
  };
};

export const authenticatedApiClient = createAuthenticatedApiClient();
