import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

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
    if (!config.headers) {
      return config;
    }

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
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error)
);

export default axiosServer as {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
};
