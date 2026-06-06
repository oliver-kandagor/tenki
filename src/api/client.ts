import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { getApiKey } from '@/config/env';

const BASE_URL = 'https://api.weather-ai.co';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const status = axiosError.response?.status ?? 0;
    const bodyMessage =
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error ??
      axiosError.message;

    switch (status) {
      case 401:
        return new ApiError('Invalid API key. Check your .env configuration.', 401);
      case 403:
        return new ApiError('This feature is not available on your plan.', 403);
      case 429:
        return new ApiError('Monthly quota exceeded. Try again after reset.', 429);
      case 400:
        return new ApiError(bodyMessage || 'Missing or invalid request parameters.', 400);
      case 500:
        return new ApiError('Server error. Please try again.', 500);
      case 503:
        return new ApiError('Service temporarily unavailable. Please retry.', 503);
      default:
        if (axiosError.code === 'ERR_NETWORK') {
          return new ApiError('Network error. Check your connection.', 0);
        }
        return new ApiError(bodyMessage || 'Something went wrong.', status);
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError('Something went wrong.', 0);
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
});

axiosClient.interceptors.request.use((config) => {
  const key = getApiKey();
  config.headers.Authorization = `Bearer ${key}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
);

export async function get<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const config: AxiosRequestConfig = { params };
  const { data } = await axiosClient.get<T>(path, config);
  return data;
}

export async function post<T>(
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const { data } = await axiosClient.post<T>(path, body);
  return data;
}

export async function postForm<T>(path: string, formData: FormData): Promise<T> {
  const { data } = await axiosClient.post<T>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function del<T>(path: string): Promise<T> {
  const { data } = await axiosClient.delete<T>(path);
  return data;
}
