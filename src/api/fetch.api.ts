import { HttpClient } from "types/api/http-client.type";

export const createFetchAdapter = (baseUrl: string): HttpClient => {
  const get = async <T>(
    path: string,
    options?: object
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        ...options,
      });
      if (!response.ok) throw Error(`Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error("GET request failed:", error);
      return undefined;
    }
  };

  const post = async <T, O>(
    path: string,
    data?: object,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
        body: data ? JSON.stringify(data) : undefined,
      });
      if (!response.ok) throw Error(`Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error("POST request failed:", error);
    }
  };

  const postFormData = async <T, O>(
    path: string,
    body: FormData,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        ...options,
        body,
      });
      if (!response.ok) throw Error(`Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error("POST request failed:", error);
    }
  };

  const deleteMethod = async <T, O>(
    path: string,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        ...options,
      });
      if (!response.ok) throw Error(`Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error("DELETE request failed:", error);
    }
  };

  return {
    get,
    post,
    postFormData,
    del: deleteMethod,
  };
};

const API_URL = import.meta.env.VITE_API_URL;
export const apiClient = createFetchAdapter(API_URL);
