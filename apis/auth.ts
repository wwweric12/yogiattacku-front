import { api } from "./apiClient";

export async function logout(): Promise<void> {
    await api.post("/auth/logout", {});
}