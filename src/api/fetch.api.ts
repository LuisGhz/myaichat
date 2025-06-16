import { ApiErrorRes } from "types/api/ApiErrorRes.type";
import { HttpClient } from "types/api/http-client.type";

export const createFetchAdapter = (baseUrl: string): HttpClient => {
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      let errorMsg = `Error: ${response.status}`;
      try {
        const errorData: ApiErrorRes = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch {
        // ignore JSON parse error, use default errorMsg
      }
      throw new Error(errorMsg);
    }
    return response;
  };

  const get = async <T>(
    path: string,
    options?: object
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        ...options,
      });
      await handleResponse(response);
      return (await response.json()) as T;
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
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
      await handleResponse(response);
      return (await response.json()) as T;
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
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
      await handleResponse(response);
      return (await response.json()) as T;
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  };

  const deleteMethod = async <O>(path: string, options?: O): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        ...options,
      });
      await handleResponse(response);
      // No need to parse body for DELETE
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  };

  const patch = async <T, O>(
    path: string,
    data?: object,
    options?: O
  ): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
        body: data ? JSON.stringify(data) : undefined,
      });
      await handleResponse(response);
      const responseText = await response.text();
      return responseText ? (JSON.parse(responseText) as T) : undefined;
    } catch (error) {
      console.error("PATCH request failed:", error);
      throw error;
    }
  };

  return {
    get,
    post,
    postFormData,
    del: deleteMethod,
    patch,
  };
};

const API_URL = import.meta.env.VITE_API_URL;
export const apiClient = createFetchAdapter(API_URL);
