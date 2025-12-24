"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "@/apis/board";
import { boardKeys } from "@/apis/utils/queryKeys";
import { Pagination } from "@/components/board/Pagination";
import { PostCard } from "@/components/board/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { BOARD_PAGE_SIZE } from "@/constants/board";

export function MyBoardContainer() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = BOARD_PAGE_SIZE;

    const { data, isLoading, error } = useQuery({
        queryKey: boardKeys.mypage(page, pageSize),
        queryFn: () => getMyPosts(page, pageSize),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(BOARD_PAGE_SIZE)].map((_, i) => (
                    <Skeleton key={i} className="h-[320px] rounded-xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">게시글을 불러오는데 실패했습니다</h3>
                <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
            </div>
        );
    }

    if (!data?.items || data.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold mb-2">작성한 게시글이 없습니다</h3>
                <p className="text-muted-foreground mb-6">첫 번째 여행 후기를 작성해보세요!</p>
            </div>
        );
    }

    const { items, page: pageInfo } = data;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">내가 쓴 글</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((post) => (
                    <PostCard key={post.boardId} post={post} />
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Pagination
                    currentPage={page}
                    hasNext={pageInfo.hasNext}
                />
            </div>
        </div>
    );
}
