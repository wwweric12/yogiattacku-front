"use client";

import { PostCard } from "@/components/board/PostCard";
import { getPopularPosts } from "@/apis/board";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/apis/utils/queryKeys";
import { queryOptions } from "@/apis/utils/queryOptions";

export function PopularPosts() {
    const { data: posts } = useQuery({
        queryKey: boardKeys.popular(),
        queryFn: getPopularPosts,
        ...queryOptions.popular,
    });

    if (!posts) return null;

    return (
        <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            이번 주 인기 여행기
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            다른 여행자들의 생생한 후기를 확인해보세요.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.boardId} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
}
