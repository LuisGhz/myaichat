type ApiClient = {
  get: <T>(path: string, options?: object) => Promise<T | undefined>;
  post: <T, O>(
    path: string,
    data?: object,
    options?: O
  ) => Promise<T | undefined>;
  patch: <T, O>(
    path: string,
    data?: object,
    options?: O
  ) => Promise<T | undefined>;
  postFormData: <T, O>(
    path: string,
    data: FormData,
    options?: O
  ) => Promise<T | undefined>;
  del: <O>(path: string, options?: O) => Promise<void>;
};
