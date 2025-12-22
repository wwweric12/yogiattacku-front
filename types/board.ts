export interface Post {
    id: number;
    userId: number;
    title: string;
    preview: string;
    thumbnailUrl: string;
    viewCount: number;
    createdAt: string;
    categoryIds: string[];
    author?: string;
    categories?: string[];
}
