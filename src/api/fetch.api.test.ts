/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock } from "vitest";
import { createFetchAdapter } from "./fetch.api";

window.fetch = vi.fn();

const baseUrl = "http://localhost/api";
const mockResponse = (status: number, body: any) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
};

describe("createFetchAdapter", () => {
  const client = createFetchAdapter(baseUrl);

  beforeEach(() => {
    (fetch as Mock).mockClear();
  });

  describe("get", () => {
    it("should return data on success", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(200, { foo: "bar" })
      );
      const data = await client.get<{ foo: string }>("/test");
      expect(data).toEqual({ foo: "bar" });
      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/test`,
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should throw error on failure", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(400, { message: "Bad Request" })
      );
      await expect(client.get("/fail")).rejects.toThrow("Bad Request");
    });
  });

  describe("post", () => {
    it("should return data on success", async () => {
      (fetch as Mock).mockImplementation(() => mockResponse(201, { id: 1 }));
      const data = await client.post<{ id: number }, undefined>("/test", {
        foo: "bar",
      });
      expect(data).toEqual({ id: 1 });
      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/test`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ foo: "bar" }),
        })
      );
    });

    it("should throw error on failure", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(500, { message: "Server Error" })
      );
      await expect(client.post("/fail", { foo: "bar" })).rejects.toThrow(
        "Server Error"
      );
    });
  });

  describe("postFormData", () => {
    it("should return data on success", async () => {
      (fetch as Mock).mockImplementation(() => mockResponse(200, { ok: true }));
      const formData = new FormData();
      formData.append("file", new Blob(["test"]));
      const data = await client.postFormData<{ ok: boolean }, undefined>(
        "/upload",
        formData
      );
      expect(data).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/upload`,
        expect.objectContaining({ method: "POST", body: formData })
      );
    });

    it("should throw error on failure", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(400, { message: "Invalid" })
      );
      const formData = new FormData();
      await expect(client.postFormData("/fail", formData)).rejects.toThrow(
        "Invalid"
      );
    });
  });

  describe("del", () => {
    it("should resolve on success", async () => {
      (fetch as Mock).mockImplementation(() => mockResponse(204, {}));
      await expect(client.del("/delete")).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/delete`,
        expect.objectContaining({ method: "DELETE" })
      );
    });

    it("should throw error on failure", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(404, { message: "Not Found" })
      );
      await expect(client.del("/fail")).rejects.toThrow("Not Found");
    });
  });

  describe("patch", () => {
    it("should return data on success", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(200, { updated: true })
      );
      const data = await client.patch<{ updated: boolean }, undefined>(
        "/patch",
        { foo: "bar" }
      );
      expect(data).toEqual({ updated: true });
      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/patch`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ foo: "bar" }),
        })
      );
    });

    it("should throw error on failure", async () => {
      (fetch as Mock).mockImplementation(() =>
        mockResponse(400, { message: "Patch Error" })
      );
      await expect(client.patch("/fail", { foo: "bar" })).rejects.toThrow(
        "Patch Error"
      );
    });
  });
});
