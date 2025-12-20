import { api } from "./utils/apiClient";
import { Post } from "@/types/board";

export const getPopularPosts = async (): Promise<Post[]> => {
    const response = await api.get("/api/posts/popular");
    return response.json();
};
