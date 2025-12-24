import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getPosts, getPostsByCategory } from "@/apis/board";
import { BoardContainer } from "@/components/board/BoardContainer";
import { boardKeys } from "@/apis/utils/queryKeys";
import { queryOptions } from "@/apis/utils/queryOptions";
import { BOARD_PAGE_SIZE } from "@/constants/board";

export default async function BoardPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; categoryIds?: string }>
}) {
    const queryClient = new QueryClient();
    const params = await searchParams;

    const page = parseInt(params.page || "1");
    const size = BOARD_PAGE_SIZE;
    const categoryIds = params.categoryIds ? params.categoryIds.split(",").filter(Boolean) : [];

    await queryClient.prefetchQuery({
        queryKey: boardKeys.posts(page, size, categoryIds),
        queryFn: () => {
            if (categoryIds.length > 0) {
                return getPostsByCategory(categoryIds, page, size);
            }
            return getPosts(page, size);
        },
        staleTime: queryOptions.board.staleTime,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BoardContainer
                initialPage={page}
                initialSize={size}
                initialCategoryIds={categoryIds}
            />
        </HydrationBoundary>
    );
}
