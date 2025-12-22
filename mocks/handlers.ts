import { http, HttpResponse } from 'msw';
import { Post } from '@/types/board';
import { BASE_URL } from '@/apis/utils/constants';
import { BOARD_CATEGORIES } from '@/constants/board';

const POSTS_COUNT = 50;

const mockPosts: Post[] = Array.from({ length: POSTS_COUNT }).map((_, i) => ({
    id: i + 1,
    userId: (i % 5) + 1,
    title: `제주도 여행 ${i + 1}일차 - ${BOARD_CATEGORIES[i % BOARD_CATEGORIES.length]} 후기`,
    preview: `제주도의 아름다운 풍경과 맛있는 음식을 즐겼던 ${i + 1}일차 여행 기록입니다. 서버가 생성한 본문 미리보기...`,
    author: `여행자${(i % 5) + 1}`,
    createdAt: "2024-03-20",
    viewCount: 100 + i * 5,
    categoryIds: [BOARD_CATEGORIES[i % BOARD_CATEGORIES.length]],
    categories: [BOARD_CATEGORIES[i % BOARD_CATEGORIES.length]],
    thumbnailUrl: `/placeholder-${(i % 3) + 1}.jpg`
}));

const paginate = (items: Post[], page: number, size: number) => {
    const start = page * size;
    const end = start + size;
    const slicedItems = items.slice(start, end);
    const hasNext = end < items.length;

    return {
        items: slicedItems,
        page,
        size,
        hasNext
    };
};

export const handlers = [
    http.get(`${BASE_URL}/board/popular`, () => {
        return HttpResponse.json({ items: mockPosts.slice(0, 9) });
    }),

    http.get(`${BASE_URL}/board`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const size = parseInt(url.searchParams.get('size') || '9');

        return HttpResponse.json(paginate(mockPosts, page, size));
    }),

    http.get(`${BASE_URL}/board/categories`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const size = parseInt(url.searchParams.get('size') || '9');
        const categoriesParam = url.searchParams.get('categories') || '';
        const targetCategories = categoriesParam.split(',').filter(Boolean);

        const filteredPosts = targetCategories.length > 0
            ? mockPosts.filter(post => post.categoryIds.some(c => targetCategories.includes(c)))
            : mockPosts;

        return HttpResponse.json(paginate(filteredPosts, page, size));
    }),
];
