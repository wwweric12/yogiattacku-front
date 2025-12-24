import { http, HttpResponse } from 'msw';
import { Post } from '@/types/board';
import { BASE_URL } from '@/apis/utils/constants';
import { BOARD_CATEGORIES } from '@/constants/board';

const POSTS_COUNT = 50;

const mockPosts: Post[] = Array.from({ length: POSTS_COUNT }).map((_, i) => ({
    boardId: i + 1,
    userId: (i % 5) + 1,
    title: `제주도 여행 ${i + 1}일차 - ${BOARD_CATEGORIES[i % BOARD_CATEGORIES.length].name} 후기`,
    nickname: `여행자${(i % 5) + 1}`,
    createdAt: "2024-03-20",
    viewCount: 100 + i * 5,
    bucketRootKey: `mock-bucket-${i}`,
    thumbnailS3Key: `images/mock/${i}.png`,
    categories: [
        { categoryId: (i % BOARD_CATEGORIES.length) + 1, name: BOARD_CATEGORIES[i % BOARD_CATEGORIES.length].name }
    ]
}));

const paginate = (items: Post[], page: number, size: number) => {
    const start = (page - 1) * size; // page is 1-based in new API
    const end = start + size;
    const slicedItems = items.slice(start, end);
    const hasNext = end < items.length;

    return {
        items: slicedItems,
        page: {
            page,
            pageSize: size,
            hasNext
        }
    };
};

export const handlers = [
    http.get(`${BASE_URL}/board/popular`, () => {
        return HttpResponse.json({
            statusCode: 200,
            message: "OK",
            data: {
                items: mockPosts.slice(0, 9),
                page: {
                    page: 1,
                    pageSize: 9,
                    hasNext: true
                }
            }
        });
    }),

    http.get(`${BASE_URL}/board`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const size = parseInt(url.searchParams.get('pageSize') || '9');
        // const categoryIds = url.searchParams.get('categoryIds')?.split(',').map(Number);

        // Filter mock posts by categoryIds if present
        const filteredPosts = mockPosts;
        // Note: mockPosts currently don't have category IDs mapping. 
        // For demonstration, we'll assume some mapping or just return all if mocked.
        // To do it properly, we'd need to add categoryIds to mockPosts.
        // For now, we will simply paginate the existing posts to ensure the UI works.

        return HttpResponse.json({
            statusCode: 200,
            message: "OK",
            data: paginate(filteredPosts, page, size)
        });
    }),

    http.get(`${BASE_URL}/board/:boardId`, ({ params }) => {
        const { boardId } = params;
        const id = Number(boardId);

        // Find existing mock post or create new one matching request
        const post = mockPosts.find(p => p.boardId === id) || {
            boardId: id,
            userId: 3,
            nickname: "닉네임",
            title: "제목입니다",
            viewCount: 12,
            bucketRootKey: "b2f4c2f7-4c1a-4e2d-9c7a-8f0b2e1a9a10",
            thumbnailS3Key: "images/board/10/thumb.png",
            createdAt: "2025-12-22T13:45:30",
            categories: [
                {
                    categoryId: 1,
                    name: "관광지"
                },
                {
                    categoryId: 2,
                    name: "음식점"
                }
            ]
        };

        return HttpResponse.json({
            statusCode: 200,
            message: "OK",
            data: {
                ...post,
                content: "# 제주도 여행기\n\n제주도는 정말 아름다운 섬입니다. **특히** 바다가 너무 예뻐요.\n\n## 방문한 곳\n- 성산일출봉\n- 우도\n\n> 즐거운 여행이었습니다!",
                updatedAt: "2025-12-22T14:10:00",
                pictures: [
                    {
                        pictureId: "a1b2c3d4-5678-90ab-cdef-123456789abc",
                        s3Key: "images/board/10/1.png",
                        contentType: "image/png"
                    }
                ]
            }
        });
    }),

];
