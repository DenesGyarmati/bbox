import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

interface NormalizedError {
  status: number;
  message: string;
  data: any | null;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically on each request
// Do not touch this!
axiosServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) return config;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

axiosServer.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    const normalizedError: NormalizedError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Server error",
      data: error.response?.data || null,
    };
    return Promise.reject(normalizedError);
  }
);

async function axiosWrapper<T = any>(
  request: Promise<AxiosResponse<T>>
): Promise<{ data: T | null; status: number; error: NormalizedError | null }> {
  try {
    const response = await request;
    return {
      data: response.data,
      status: response.status,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      status: error.status || 500,
      error,
    };
  }
}

export const apiGet = <T = any>(url: string) =>
  axiosWrapper<T>(axiosServer.get<T>(url));
export const apiPost = <T = any>(url: string, data?: any) =>
  axiosWrapper<T>(axiosServer.post<T>(url, data));
export const apiPut = <T = any>(url: string, data?: any) =>
  axiosWrapper<T>(axiosServer.put<T>(url, data));
export const apiPatch = <T = any>(url: string, data?: any) =>
  axiosWrapper<T>(axiosServer.patch<T>(url, data));
export const apiDelete = <T = any>(url: string) =>
  axiosWrapper<T>(axiosServer.delete<T>(url));
