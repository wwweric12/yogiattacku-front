import { MyBoardContainer } from "@/components/board/MyBoardContainer";
import { QueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/apis/utils/queryKeys";
import { getMyPosts } from "@/apis/board";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BOARD_PAGE_SIZE } from "@/constants/board";

interface MyPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const pageSize = BOARD_PAGE_SIZE;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: boardKeys.mypage(page, pageSize),
        queryFn: () => getMyPosts(page, pageSize),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="container mx-auto px-4 py-8">
                <MyBoardContainer />
            </div>
        </HydrationBoundary>
    );
}
