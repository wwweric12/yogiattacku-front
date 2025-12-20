import { BASE_URL } from "../utils/constants";
import { NetworkError, AuthError, ApiError } from "../utils/error";

export async function refreshAccessTokenForMiddleware(refreshToken: string) {
    return fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Cookie': `REFRESH_TOKEN=${refreshToken}`
        }
    });
}

export async function refreshAccessToken(): Promise<void> {
    let response: Response;
    try {
        response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    } catch (error) {
        throw new NetworkError(error instanceof Error ? error.message : "Unknown network error");
    }

    if (!response.ok) {
        const errorMessage = response.statusText;

        if (response.status === 401 || response.status === 403) {
            throw new AuthError(errorMessage, response.status);
        } else {
            throw new ApiError(response.status, errorMessage);
        }
    }
}
export function isTokenExpired(token: string) {
    try {
        const base64Payload = token.split('.')[1];
        const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        // 현재 시간보다 만료 시간이 지났으면 true (여유 시간 2초 줌)
        return (exp * 1000) < (Date.now() + 2000);
    } catch (e) {
        return true; // 파싱 실패 시 만료된 것으로 간주
    }
}

