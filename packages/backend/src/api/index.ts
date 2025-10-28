import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      ...config,
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[HttpClient] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[HttpClient] Request error:", error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[HttpClient] Response received: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        console.error("[HttpClient] Response error:", error.message);
        return Promise.reject(error);
      },
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(requestFn: () => Promise<T>, retryCount: number = 0): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      const axiosError = error as AxiosError;

      // Check if error is retryable
      const isRetryable =
        axiosError.code === "ECONNABORTED" || // Timeout
        axiosError.code === "ECONNRESET" || // Connection reset
        axiosError.code === "ENOTFOUND" || // DNS resolution failed
        axiosError.code === "ECONNREFUSED" || // Connection refused
        (axiosError.response?.status && axiosError.response.status >= 500); // Server errors

      if (isRetryable && retryCount < this.maxRetries) {
        console.warn(`[HttpClient] Retry ${retryCount + 1}/${this.maxRetries} after error:`, axiosError.message);
        await this.sleep(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.retryRequest(requestFn, retryCount + 1);
      }

      throw error;
    }
  }

  // GET
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    });
  }

  // POST
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    });
  }

  // PUT
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    });
  }

  // DELETE
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    });
  }

  // PATCH
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    });
  }
}
