"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    axiosInstance;
    maxRetries = 3;
    retryDelay = 1000; // 1 second
    constructor(baseURL, config) {
        this.axiosInstance = axios_1.default.create({
            baseURL,
            timeout: 30000, // 30 seconds timeout
            ...config,
        });
        // Add request interceptor for logging
        this.axiosInstance.interceptors.request.use((config) => {
            console.log(`[HttpClient] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error("[HttpClient] Request error:", error);
            return Promise.reject(error);
        });
        // Add response interceptor for error handling
        this.axiosInstance.interceptors.response.use((response) => {
            console.log(`[HttpClient] Response received: ${response.status} ${response.statusText}`);
            return response;
        }, (error) => {
            console.error("[HttpClient] Response error:", error.message);
            return Promise.reject(error);
        });
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async retryRequest(requestFn, retryCount = 0) {
        try {
            return await requestFn();
        }
        catch (error) {
            const axiosError = error;
            // Check if error is retryable
            const isRetryable = axiosError.code === "ECONNABORTED" || // Timeout
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
    async get(url, config) {
        return this.retryRequest(async () => {
            const response = await this.axiosInstance.get(url, config);
            return response.data;
        });
    }
    // POST
    async post(url, data, config) {
        return this.retryRequest(async () => {
            const response = await this.axiosInstance.post(url, data, config);
            return response.data;
        });
    }
    // PUT
    async put(url, data, config) {
        return this.retryRequest(async () => {
            const response = await this.axiosInstance.put(url, data, config);
            return response.data;
        });
    }
    // DELETE
    async delete(url, config) {
        return this.retryRequest(async () => {
            const response = await this.axiosInstance.delete(url, config);
            return response.data;
        });
    }
    // PATCH
    async patch(url, data, config) {
        return this.retryRequest(async () => {
            const response = await this.axiosInstance.patch(url, data, config);
            return response.data;
        });
    }
}
exports.HttpClient = HttpClient;
