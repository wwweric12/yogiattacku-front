import { getDefaultStore } from 'jotai';
import { accessTokenAtom } from '@/atoms/auth';
import { BASE_URL } from './constants';
import { refreshAccessToken } from './auth';
import { ApiError, AuthError, ErrorResponse } from './error';

type RequestConfig = RequestInit & {
    headers?: Record<string, string>;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onRefreshed = (token: string | null) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
    refreshSubscribers.push(callback);
};

async function fetchClient(endpoint: string, config: RequestConfig = {}) {
    const store = getDefaultStore();
    let token = store.get(accessTokenAtom);

    const headers: Record<string, string> = { ...config.headers };

    if (!(config.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;

    let response = await fetch(url, { ...config, headers });

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshAccessToken();
                store.set(accessTokenAtom, newToken);
                onRefreshed(newToken);


                headers["Authorization"] = `Bearer ${newToken}`;
                const retryResponse = await fetch(url, { ...config, headers });
                return handleResponse(retryResponse);
            } catch (error) {
                store.set(accessTokenAtom, null);
                onRefreshed(null);
                throw error;
            } finally {
                isRefreshing = false;
            }
        } else {

            return new Promise<Response>((resolve, reject) => {
                addRefreshSubscriber(async (newToken) => {
                    if (!newToken) {
                        reject(new AuthError("Token refresh failed", 401));
                        return;
                    }
                    try {
                        headers["Authorization"] = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, { ...config, headers });
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