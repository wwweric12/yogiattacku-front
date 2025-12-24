"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost, deletePost } from "@/apis/board";
import { boardKeys } from "@/apis/utils/queryKeys";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Trash2 } from "lucide-react";

const Editor = dynamic(() => import("@/components/board/Editor"), {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />
});

interface PostDetailContainerProps {
    boardId: number;
}

export function PostDetailContainer({ boardId }: PostDetailContainerProps) {
    const router = useRouter();
    const { data: post, isLoading, error } = useQuery({
        queryKey: boardKeys.detail(boardId),
        queryFn: () => getPost(boardId),
    });

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deletePost(boardId);
                await queryClient.invalidateQueries({ queryKey: boardKeys.all });
                router.push("/board");
            } catch (error) {
                console.error("Failed to delete post:", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    if (isLoading) {
        return <Skeleton className="w-full h-[500px]" />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[500px] gap-4">
                <p className="text-xl font-medium text-gray-500">게시글을 불러오는데 실패했습니다.</p>
                <Link href="/board">
                    <Button variant="outline">목록으로 돌아가기</Button>
                </Link>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" asChild>
                    <Link href="/board" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        목록으로 돌아가기
                    </Link>
                </Button>
            </div>

            <article className="space-y-8">

                <div className="space-y-4 border-b pb-6">
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <span
                                key={category.categoryId}
                                className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
                        {post.isAuthor && (
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제하기
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={post.profileImageUrl || "/avatars/01.png"} alt={post.nickname} />
                                <AvatarFallback>{post.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{post.nickname}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount}</span>
                        </div>
                    </div>
                </div>
                <div className="min-h-[300px]">
                    <Editor
                        markdown={post.content}
                        bucketRootKey={post.bucketRootKey}
                        readOnly={true}
                    />
                </div>
            </article>
        </div>
    );
}
