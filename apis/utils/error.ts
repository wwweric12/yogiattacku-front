export interface ErrorResponse {
    message?: string;
    [key: string]: unknown;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export class AuthError extends ApiError {
    constructor(message: string = "Authentication failed", status: number = 401, data?: unknown) {
        super(status, message, data);
        this.name = "AuthError";
    }
}

export class NetworkError extends ApiError {
    constructor(message: string = "Network error occurred") {
        super(0, message);
        this.name = "NetworkError";
    }
}
