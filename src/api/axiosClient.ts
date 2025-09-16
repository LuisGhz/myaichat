import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

// Adapter over axios that conforms to the ApiClient type defined in types/api/ApiClient.d.ts
// - Adds Authorization: Bearer <token> when a token exists in localStorage under "auth_token"
// - Exposes a small surface (get/post/patch/postFormData/del) returning response data

const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

function hasSetHeader(
  headers: unknown
): headers is { set: (name: string, value: string) => void } {
  return (
    !!headers &&
    typeof headers === "object" &&
    "set" in headers &&
    typeof (headers as { set?: unknown }).set === "function"
  );
}

function createAxiosInstance(config?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL ?? "/",
    headers: {
      Accept: "application/json",
    },
    ...config,
  });

  // Inject JWT on each request if available
  instance.interceptors.request.use((req) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Preserve any pre-set header while ensuring Authorization is set
        if (hasSetHeader(req.headers)) {
          req.headers.set("Authorization", `Bearer ${token}`);
        } else {
          const existing = (req.headers ?? {}) as AxiosRequestHeaders;
          const merged: AxiosRequestHeaders = {
            ...(existing as Record<string, unknown>),
            Authorization: `Bearer ${token}`,
          } as AxiosRequestHeaders;
          req.headers = merged;
        }
      }
    } catch {
      // In non-browser contexts localStorage may not exist; ignore silently
    }
    return req;
  });

  return instance;
}

export const createApiClient = (
  axiosConfig?: AxiosRequestConfig
): ApiClient => {
  const client = createAxiosInstance(axiosConfig);

  const get = async <T>(
    path: string,
    options?: object
  ): Promise<T | undefined> => {
    try {
      const res = await client.get(path, options as AxiosRequestConfig);
      return res.data as T;
    } catch (err) {
      console.error("GET error", { path, err });
      return undefined;
    }
  };

  const post = async <T, O>(
    path: string,
    data?: object,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const res = await client.post(path, data, options as AxiosRequestConfig);
      return res.data as T;
    } catch (err) {
      console.error("POST error", { path, err });
      return undefined;
    }
  };

  const patch = async <T, O>(
    path: string,
    data?: object,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const res = await client.patch(path, data, options as AxiosRequestConfig);
      if (!res.data) return;
      return res.data as T;
    } catch (err) {
      console.error("PATCH error", { path, err });
      return undefined;
    }
  };

  const postFormData = async <T, O>(
    path: string,
    data: FormData,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const config: AxiosRequestConfig = {
        ...(options as AxiosRequestConfig),
        headers: {
          ...((options as AxiosRequestConfig)?.headers ?? {}),
          // Let axios/browser set the correct multipart boundary; do not hardcode it
          // You can uncomment the next line if your backend requires it explicitly
          // "Content-Type": "multipart/form-data",
        },
      };
      const res = await client.post(path, data, config);
      return res.data as T;
    } catch (err) {
      console.error("POST form-data error", { path, err });
      return undefined;
    }
  };

  const del = async <O>(path: string, options?: O): Promise<void> => {
    try {
      await client.delete(path, options as AxiosRequestConfig);
    } catch (err) {
      // For deletes, propagate so callers can act (e.g., optimistic UI rollback)
      console.error("DELETE error", { path, err });
      throw err as unknown;
    }
  };

  return { get, post, patch, postFormData, del } as ApiClient;
};

// Default singleton instance for app-wide use
export const apiClient: ApiClient = createApiClient();

export default apiClient;
