/**
 * Internal Router Service
 * 
 * This service acts as an abstraction layer between the application
 * and external APIs. It provides a unified interface for all API calls,
 * hiding the actual API endpoints and allowing for easy maintenance,
 * logging, and transformation of API requests and responses.
 */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
}

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

class InternalRouter {
  private baseUrl: string;
  private defaultTimeout: number = 30000; // 30 seconds
  private authToken?: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || "/api") {
    this.baseUrl = baseUrl;
    this.loadAuthToken();
  }

  /**
   * Load authentication token from localStorage
   */
  private loadAuthToken(): void {
    if (typeof window !== "undefined") {
      this.authToken = window.localStorage.getItem("auth_token") || undefined;
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("auth_token", token);
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth_token");
    }
  }

  /**
   * Build internal request path
   * @param endpoint - The endpoint to call (without /api prefix)
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Build request headers with auth token
   */
  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Perform HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const method = options.method || "GET";
    const headers = this.buildHeaders(options);
    const timeout = options.timeout || this.defaultTimeout;

    const controller = options.signal
      ? new AbortController()
      : new AbortController();

    const timeoutId =
      timeout > 0
        ? setTimeout(() => {
            controller.abort();
          }, timeout)
        : null;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal || controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      let data: unknown;
      try {
        data = isJson ? await response.json() : await response.text();
      } catch {
        data = null;
      }

      if (!response.ok) {
        return {
          status: response.status,
          error: response.statusText,
          message:
            typeof data === "object" &&
            data !== null &&
            "message" in data
              ? (String((data as Record<string, unknown>).message) || undefined)
              : undefined,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        status: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }
}

// Export singleton instance
export const router = new InternalRouter();

// Export class for testing or custom instances
export { InternalRouter };
export type { ApiResponse, RequestOptions };
