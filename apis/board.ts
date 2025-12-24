import { api } from "./utils/apiClient";
import { Post, ApiResponse, BucketRootKeyResponse, PostImageUploadResponse, PostCreateRequest, BoardResponse, PostDetail, PresignedUrlRequest } from "@/types/board";

export const getPopularPosts = async (): Promise<Post[]> => {
    const response = await api.get("/board/popular");
    const body = await response.json();
    return body.data;
};

export const getPosts = async (page: number, size: number): Promise<BoardResponse> => {
    const response = await api.get(`/board?page=${page}&pageSize=${size}`);
    const body = await response.json();

    return body.data;
};

export const getPostsByCategory = async (categoryIds: string[], page: number, size: number): Promise<BoardResponse> => {
    const categoryParam = categoryIds.join(",");
    const response = await api.get(`/board?categoryIds=${encodeURIComponent(categoryParam)}&page=${page}&pageSize=${size}`);
    const body = await response.json();
    return body.data;
};

export const getMyPosts = async (page: number, size: number): Promise<BoardResponse> => {
    const response = await api.get(`/board/mypage?page=${page}&pageSize=${size}`);
    const body = await response.json();
    return body.data;
};

export const getBucketRootKey = async (): Promise<BucketRootKeyResponse> => {
    const response = await api.get("/board/write");
    const body = await response.json() as ApiResponse<BucketRootKeyResponse>;

    return body.data;
};


export const getPresignedUrl = async (params: PresignedUrlRequest): Promise<PostImageUploadResponse> => {
    const response = await api.post(`/board/picture/presign`, params);
    const body = await response.json() as ApiResponse<PostImageUploadResponse>;
    return body.data;
};

export const createPost = async (data: PostCreateRequest): Promise<void> => {
    await api.post("/board", data);
};

export const getPost = async (boardId: number): Promise<PostDetail> => {
    const response = await api.get(`/board/${boardId}`);
    const body = await response.json();
    return body.data;
};

export const deletePost = async (boardId: number): Promise<void> => {
    await api.delete(`/board/${boardId}`);
};
