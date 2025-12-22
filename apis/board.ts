import { api } from "./utils/apiClient";
import { Post } from "@/types/board";

export interface Page<T> {
    items: T[];
    page: number;
    size: number;
    hasNext: boolean;
}

export const getPopularPosts = async (): Promise<Post[]> => {
    const response = await api.get("/board/popular");
    const data = await response.json();
    return data.items;
};

export const getPosts = async (page: number, size: number): Promise<Page<Post>> => {
    const response = await api.get(`/board?page=${page}&size=${size}`);
    return response.json();
};

export const getPostsByCategory = async (categories: string[], page: number, size: number): Promise<Page<Post>> => {
    const categoryParam = categories.join(",");
    const response = await api.get(`/board/categories?categories=${encodeURIComponent(categoryParam)}&page=${page}&size=${size}`);
    return response.json();
};
