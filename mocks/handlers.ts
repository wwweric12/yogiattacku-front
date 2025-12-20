import { http, HttpResponse } from 'msw';
import { Post } from '@/types/board';
import { BASE_URL } from '@/apis/utils/constants';

const mockPosts: Post[] = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: `제주도 여행 ${i + 1}일차 후기`,
    content: `제주도의 아름다운 풍경과 맛있는 음식을 즐겼던 ${i + 1}일차 여행 기록입니다. 특히 성산일출봉의 일출이 기억에 남네요.`,
    author: `여행자${i + 1}`,
    createdAt: "2024-03-20",
    views: 120 + i * 10,
    category: "국내여행",
    thumbnail: `/placeholder-${(i % 3) + 1}.jpg`
}));

export const handlers = [
    http.get(`${BASE_URL}/api/posts/popular`, () => {
        return HttpResponse.json(mockPosts);
    }),
];
