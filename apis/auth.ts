import { BASE_URL } from "./constants";
import { ApiError, AuthError, NetworkError } from "./error";

export async function refreshAccessToken(): Promise<string> {
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

    if (response.ok) {
        const authHeader = response.headers.get("Authorization");
        if (authHeader) {
            return authHeader.replace("Bearer ", "");
        } else {
            throw new ApiError(response.status, "No Authorization header present");
        }
    }

    else {
        const errorMessage = response.statusText;

        if (response.status === 401 || response.status === 403) {
            throw new AuthError(errorMessage);
        } else {
            throw new ApiError(response.status, errorMessage);
        }
    }
}