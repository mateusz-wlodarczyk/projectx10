"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    axiosInstance;
    constructor(baseURL, config) {
        this.axiosInstance = axios_1.default.create({
            baseURL,
            ...config,
        });
    }
    // GET
    get(url, config) {
        return this.axiosInstance.get(url, config).then((response) => response.data);
    }
    // POST
    post(url, data, config) {
        return this.axiosInstance.post(url, data, config).then((response) => response.data);
    }
    // PUT
    put(url, data, config) {
        return this.axiosInstance.put(url, data, config).then((response) => response.data);
    }
    // DELETE
    delete(url, config) {
        return this.axiosInstance.delete(url, config).then((response) => response.data);
    }
    // PATCH
    patch(url, data, config) {
        return this.axiosInstance.patch(url, data, config).then((response) => response.data);
    }
}
exports.HttpClient = HttpClient;
