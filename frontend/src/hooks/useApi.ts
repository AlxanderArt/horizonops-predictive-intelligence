import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
  status?: number;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  const navigate = useNavigate();
  const { logout } = useAuth();

  const execute = useCallback(
    async (
      url: string,
      options?: RequestInit,
      retries = 2
    ): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          const errorMessage = await getErrorMessage(response);

          // Handle auth errors
          if (response.status === 401) {
            logout();
            navigate('/login');
            throw new Error('Session expired. Please log in again.');
          }

          if (response.status === 403) {
            throw new Error('You do not have permission to access this resource.');
          }

          if (response.status === 404) {
            throw new Error('The requested resource was not found.');
          }

          if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (err) {
        const error = err as Error;

        // Retry on network errors
        if (error.name === 'AbortError') {
          if (retries > 0) {
            return execute(url, options, retries - 1);
          }
          const message = 'Request timed out. Please check your connection.';
          setState({ data: null, isLoading: false, error: message });
          return null;
        }

        // Retry on network failures
        if (error.message === 'Failed to fetch' && retries > 0) {
          await delay(1000 * (3 - retries)); // Exponential backoff
          return execute(url, options, retries - 1);
        }

        setState({ data: null, isLoading: false, error: error.message });
        return null;
      }
    },
    [navigate, logout]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData: (data: T | null) => setState((prev) => ({ ...prev, data })),
  };
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.detail || data.message || data.error || `Error: ${response.status}`;
  } catch {
    return `HTTP Error: ${response.status} ${response.statusText}`;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple fetch wrapper for one-off calls
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      return { data: null, error: errorMessage };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message || 'An unexpected error occurred' };
  }
}
