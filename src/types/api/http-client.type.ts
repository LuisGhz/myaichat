export type HttpClient = {
  get: <T>(path: string, options?: object) => Promise<T | undefined>;
  post: <T, O>(
    path: string,
    data?: object,
    options?: O
  ) => Promise<T | undefined>;
  del: <T, O>(path: string, options?: O) => Promise<T | undefined>;
};
