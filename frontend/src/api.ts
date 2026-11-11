import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

export function errorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.response?.data?.message;
  if (typeof message === 'string') return message;
  if (error.response) return 'The request failed. Please try again.';
  return 'Cannot reach the server. Please check that the backend is running.';
}
