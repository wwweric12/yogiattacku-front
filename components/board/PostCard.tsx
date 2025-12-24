import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, Calendar, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/board";
import { Button } from "@/components/ui/button";
import { deletePost, getPost } from "@/apis/board";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/apis/utils/queryKeys";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const queryClient = useQueryClient();

    const handleMouseEnter = () => {
        queryClient.prefetchQuery({
            queryKey: boardKeys.detail(post.boardId),
            queryFn: () => getPost(post.boardId),
        });
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deletePost(post.boardId);
                await queryClient.invalidateQueries({ queryKey: boardKeys.all });
            } catch (error) {
                console.error("Failed to delete post:", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    return (
        <Link
            href={`/board/${post.boardId}`}
            className="block h-full"
            onMouseEnter={handleMouseEnter}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col group"> {/* Added group for hover effect */}
                <div className="relative h-48 w-full">
                    <Image
                        src={post.thumbnailS3Key ? `https://d2ft5bvi4f9u8o.cloudfront.net/${post.thumbnailS3Key}` : "/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1 flex-wrap">
                            {post.categories?.map((category) => (
                                <span
                                    key={category.categoryId}
                                    className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">{post.nickname}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.viewCount}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
