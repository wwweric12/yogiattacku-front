import { BASE_URL } from './constants';
import { refreshAccessToken } from '../auth/token';
import { ApiError, AuthError, ErrorResponse, NetworkError } from './error';

type RequestConfig = RequestInit & {
    headers?: Record<string, string>;
};

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const onRefreshed = (success: boolean) => {
    refreshSubscribers.forEach((callback) => callback(success));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (success: boolean) => void) => {
    refreshSubscribers.push(callback);
};

async function fetchClient(endpoint: string, config: RequestConfig = {}) {
    const headers: Record<string, string> = { ...config.headers };

    if (config.body !== undefined && !(config.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;

    let response: Response;
    try {
        // credentials: 'include' is crucial for sending cookies
        response = await fetch(url, { ...config, headers, credentials: 'include' });
    } catch (error) {
        throw new NetworkError(error instanceof Error ? error.message : "Unknown network error");
    }

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                await refreshAccessToken();
                onRefreshed(true);

                // Retry original request (cookies are automatically attached)
                const retryResponse = await fetch(url, { ...config, headers, credentials: 'include' });
                return handleResponse(retryResponse);
            } catch (error) {
                onRefreshed(false);
                throw error;
            } finally {
                isRefreshing = false;
            }
        } else {

            return new Promise<Response>((resolve, reject) => {
                addRefreshSubscriber(async (success) => {
                    if (!success) {
                        reject(new AuthError("Token refresh failed", 401));
                        return;
                    }
                    try {
                        const retryResponse = await fetch(url, { ...config, headers, credentials: 'include' });
                        const result = await handleResponse(retryResponse);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }
    }

    return handleResponse(response);
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        let errorMessage = response.statusText;
        let errorData: ErrorResponse | undefined;

        try {
            errorData = await response.json() as ErrorResponse;
            errorMessage = errorData.message || errorMessage;
        } catch {

        }

        if (response.status === 401) {
            throw new AuthError(errorMessage, response.status, errorData);
        }

        throw new ApiError(response.status, errorMessage, errorData);
    }
    return response;
}

export const api = {
    get: (endpoint: string, config?: RequestConfig) =>
        fetchClient(endpoint, { ...config, method: "GET" }),

    post: (endpoint: string, body: any, config?: RequestConfig) =>
        fetchClient(endpoint, {
            ...config,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body)
        }),

    put: (endpoint: string, body: any, config?: RequestConfig) =>
        fetchClient(endpoint, {
            ...config,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body)
        }),

    delete: (endpoint: string, config?: RequestConfig) =>
        fetchClient(endpoint, { ...config, method: "DELETE" }),
};