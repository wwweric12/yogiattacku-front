import { api } from "../utils/apiClient";

export async function logout(): Promise<void> {
    await api.post("/auth/logout", {});
}