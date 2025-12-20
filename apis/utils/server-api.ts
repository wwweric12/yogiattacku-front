import { cookies } from "next/headers";
import { BASE_URL } from './constants';

export async function fetchServer(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headers = new Headers(options.headers);
    if (cookieHeader) {
        headers.set("Cookie", cookieHeader);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    return res.json();
}
