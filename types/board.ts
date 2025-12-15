export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    views: number;
    category: string;
    thumbnail?: string;
}
