type ApiClient = {
  get: <T>(path: string, options?: object) => Promise<T | undefined>;
  post: <T, O = AxiosRequestConfig>(
    path: string,
    data?: object,
    options?: O
  ) => Promise<T | undefined>;
  patch: <T, O = AxiosRequestConfig>(
    path: string,
    data?: object,
    options?: O
  ) => Promise<T | undefined>;
  postFormData: <T, O = AxiosRequestConfig>(
    path: string,
    data: FormData,
    options?: O
  ) => Promise<T | undefined>;
  del: <O = AxiosRequestConfig>(path: string, options?: O) => Promise<void>;
  getStream: <T>(
    path: string,
    onChunk: (chunk: T) => void,
    signal?: AbortSignal
  ) => Promise<void>;
};
