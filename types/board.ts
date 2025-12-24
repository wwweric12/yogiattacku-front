export interface Category {
    categoryId: number;
    name: string;
}

export interface Post {
    boardId: number;
    userId: number;
    nickname: string;
    profileImageUrl: string | null;
    title: string;
    viewCount: number;
    bucketRootKey: string;
    thumbnailS3Key: string;
    isAuthor?: boolean;
    createdAt: string;
    categories: Category[];
}

export interface PostImage {
    pictureId: string;
    s3Key: string;
    contentType: string;
}

export interface PostDetail extends Post {
    content: string;
    updatedAt: string;
    pictures: PostImage[];
}

export interface PageInfo {
    page: number;
    pageSize: number;
    hasNext: boolean;
}

export interface BoardResponse {
    items: Post[];
    page: PageInfo;
}

export interface PostCreateRequest {
    bucketRootKey: string;
    title: string;
    content: string;
    categoryIds: number[];
    s3Keys: string[];
}

export interface PostImageUploadResponse {
    uploadUrl: string;
    s3Key: string;
    publicUrl: string;
}

export interface BucketRootKeyResponse {
    bucketRootKey: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface PresignedUrlRequest {
    bucketRootKey: string;
    contentType: string;
    fileExt: string;
    fileSize: number;
}
