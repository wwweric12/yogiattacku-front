import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getPosts, getPostsByCategory } from "@/apis/board";
import { BoardContainer } from "@/components/board/BoardContainer";
import { boardKeys } from "@/apis/utils/queryKeys";
import { queryOptions } from "@/apis/utils/queryOptions";

export default async function BoardPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; categories?: string }>
}) {
    const queryClient = new QueryClient();
    const params = await searchParams;

    const page = parseInt(params.page || "0");
    const size = 9;
    const categories = params.categories ? params.categories.split(",").filter(Boolean) : [];

    await queryClient.prefetchQuery({
        queryKey: boardKeys.posts(page, size, categories),
        queryFn: () => {
            if (categories.length > 0) {
                return getPostsByCategory(categories, page, size);
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
                initialCategories={categories}
            />
        </HydrationBoundary>
    );
}
