/**
 * Production-Ready API Service
 * Optimized for performance with caching, retry logic, and error handling
 */

import axios from 'axios';
import { showToast } from '../components/Toast';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with production optimizations
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for authentication and performance
api.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = generateRequestId();

        // Add timestamp for performance monitoring
        config.metadata = { startTime: new Date() };

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for performance monitoring and error handling
api.interceptors.response.use(
    (response) => {
        // Calculate response time
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;

        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);

        // Log slow responses
        if (duration > 2000) {
            console.warn(`⚠️ Slow API Response: ${response.config.url} took ${duration}ms`);
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Calculate response time for failed requests
        if (originalRequest?.metadata?.startTime) {
            const duration = new Date() - originalRequest.metadata.startTime;
            console.error(`❌ API Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${duration}ms)`);
        }

        // Handle different error types
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - token expired
                    console.warn('🔐 Token expired, attempting refresh...');
                    await handleTokenRefresh();
                    return api(originalRequest); // Retry original request

                case 403:
                    showToast('Access denied. You do not have permission for this action.', 'error');
                    break;

                case 404:
                    showToast('Resource not found.', 'error');
                    break;

                case 429:
                    showToast('Too many requests. Please try again later.', 'warning');
                    break;

                case 500:
                    showToast('Server error. Please try again later.', 'error');
                    break;

                default:
                    showToast(data?.error || 'An error occurred.', 'error');
            }
        } else if (error.request) {
            // Network error
            console.error('🌐 Network Error:', error.message);
            showToast('Network error. Please check your connection.', 'error');
        } else {
            // Other error
            console.error('❌ Unknown Error:', error.message);
            showToast('An unexpected error occurred.', 'error');
        }

        return Promise.reject(error);
    }
);

// Generate unique request ID
const generateRequestId = () => {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Handle token refresh
const handleTokenRefresh = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
        });

        const { token } = response.data.data;
        localStorage.setItem('token', token);

        console.log('🔄 Token refreshed successfully');
    } catch (error) {
        console.error('❌ Token refresh failed:', error);
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
};

// Retry configuration
const retryConfig = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
        // Retry on network errors and 5xx server errors
        return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }
};

// Enhanced API methods with retry logic
const apiWithRetry = async (config) => {
    let lastError;

    for (let i = 0; i <= retryConfig.retries; i++) {
        try {
            return await api(config);
        } catch (error) {
            lastError = error;

            // Don't retry if condition not met
            if (!retryConfig.retryCondition(error)) {
                throw error;
            }

            // Don't retry on last attempt
            if (i === retryConfig.retries) {
                throw error;
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * (i + 1)));
            console.log(`🔄 Retrying API request (${i + 1}/${retryConfig.retries}): ${config.url}`);
        }
    }

    throw lastError;
};

// Production-ready API methods
export const productionApi = {
    // GET request with caching
    get: async (url, config = {}) => {
        return apiWithRetry({ ...config, method: 'GET', url });
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        return apiWithRetry({ ...config, method: 'POST', url, data });
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        return apiWithRetry({ ...config, method: 'PUT', url, data });
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        return apiWithRetry({ ...config, method: 'PATCH', url, data });
    },

    // DELETE request
    delete: async (url, config = {}) => {
        return apiWithRetry({ ...config, method: 'DELETE', url });
    },

    // File upload
    upload: async (url, formData, config = {}) => {
        return apiWithRetry({
            ...config,
            method: 'POST',
            url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers
            }
        });
    }
};

// Request cache for GET requests
class RequestCache {
    constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes TTL
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    set(key, data) {
        // Remove oldest item if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }

    delete(key) {
        this.cache.delete(key);
    }
}

// Global cache instance
export const requestCache = new RequestCache();

// Cached GET requests
export const cachedGet = async (url, config = {}) => {
    const cacheKey = `GET:${url}:${JSON.stringify(config.params || {})}`;

    // Try to get from cache first
    const cachedData = requestCache.get(cacheKey);
    if (cachedData) {
        console.log(`📦 Cache hit: ${url}`);
        return { data: cachedData };
    }

    // Fetch from API
    const response = await productionApi.get(url, config);

    // Cache the response
    requestCache.set(cacheKey, response.data);
    console.log(`📦 Cache set: ${url}`);

    return response;
};

// Batch requests for performance
export const batchRequests = async (requests) => {
    const startTime = Date.now();

    try {
        const responses = await Promise.allSettled(
            requests.map(req => productionApi[req.method.toLowerCase()](req.url, req.data, req.config))
        );

        const duration = Date.now() - startTime;
        console.log(`🚀 Batch requests completed in ${duration}ms`);

        return responses;
    } catch (error) {
        console.error('❌ Batch requests failed:', error);
        throw error;
    }
};

// Performance monitoring
export const performanceMonitor = {
    // Track API performance
    trackApiCall: (url, method, duration, success) => {
        const metric = {
            url,
            method,
            duration,
            success,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage for debugging
        const metrics = JSON.parse(localStorage.getItem('apiMetrics') || '[]');
        metrics.push(metric);

        // Keep only last 100 metrics
        if (metrics.length > 100) {
            metrics.splice(0, metrics.length - 100);
        }

        localStorage.setItem('apiMetrics', JSON.stringify(metrics));
    },

    // Get performance stats
    getStats: () => {
        const metrics = JSON.parse(localStorage.getItem('apiMetrics') || '[]');

        if (metrics.length === 0) return null;

        const totalRequests = metrics.length;
        const successfulRequests = metrics.filter(m => m.success).length;
        const averageDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
        const slowestRequest = metrics.reduce((max, m) => Math.max(max, m.duration), 0);
        const fastestRequest = metrics.reduce((min, m) => Math.min(min, m.duration), Infinity);

        return {
            totalRequests,
            successfulRequests,
            successRate: (successfulRequests / totalRequests * 100).toFixed(2),
            averageDuration: averageDuration.toFixed(2),
            slowestRequest,
            fastestRequest
        };
    },

    // Clear metrics
    clearStats: () => {
        localStorage.removeItem('apiMetrics');
    }
};

export default api;
