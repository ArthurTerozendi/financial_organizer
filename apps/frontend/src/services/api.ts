import axios from "axios";
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";

interface ApiResponse<T> {
  status?: number;
  type: "success" | "error";
  data?: T;
  error?: Error;
  message?: string;
}

export function useApi(navigate: NavigateFunction) {
  const makeRequest = useCallback(
    async <T1, T2>(
      url: string,
      options: {
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: T1;
      },
    ): Promise<ApiResponse<T2>> => {
      const token = localStorage.getItem("jwtToken");
      const headers: Record<string, string> = {};

      if (token !== null && token !== undefined && token !== "undefined" && token !== "null" && token !== "") {
        headers.Authorization = `Bearer ${token}`;
      }

      return axios
        .request<T1, ApiResponse<T2>>({
          baseURL: import.meta.env.VITE_API_URL,
          headers,
          method: options.method,
          url,
          data: options.body,
        })
        .then((response) => {
          return response;
        })
        .catch((e) => {
          if (e.response?.status === 401) {
            localStorage.removeItem("jwtToken");
            navigate("/login");
          }
          return {
            type: "error",
            error: new Error(JSON.stringify(e)),
            message: e.message,
          };
        });
    },
    [navigate],
  );

  // due to some weird typescript behavior, this constrain forces the request data to be a type and not interface
  const getRequest = useCallback(
    <T1 extends { [key: string]: string | number }, T2>(
      url: string,
      params?: T1,
    ): Promise<ApiResponse<T2>> => {
      let newURL = url;

      if (params) {
        const searchParams = Object.keys(params)
          .filter((key) => typeof params[key] !== "undefined")
          .map((key) => `${key}=${encodeURIComponent(params[key].toString())}`);

        newURL = `${url}?${searchParams.join("&")}`;
      }

      return makeRequest<object, T2>(newURL, { method: "GET" });
    },
    [makeRequest],
  );

  const putRequest = useCallback(
    <T1, T2>(url: string, body?: T1): Promise<ApiResponse<T2>> =>
      makeRequest<T1, T2>(url, { method: "PUT", body }),
    [makeRequest],
  );

  const postRequest = useCallback(
    <T1, T2>(url: string, body?: T1): Promise<ApiResponse<T2>> =>
      makeRequest<T1, T2>(url, { method: "POST", body }),
    [makeRequest],
  );

  const patchRequest = useCallback(
    <T1, T2>(url: string, body?: T1): Promise<ApiResponse<T2>> =>
      makeRequest<T1, T2>(url, { method: "PATCH", body }),
    [makeRequest],
  );

  const deleteRequest = useCallback(
    <T1, T2>(url: string, body?: T1): Promise<ApiResponse<T2>> =>
      makeRequest<T1, T2>(url, { method: "DELETE", body }),
    [makeRequest],
  );

  return { getRequest, postRequest, patchRequest, deleteRequest, putRequest };
}
