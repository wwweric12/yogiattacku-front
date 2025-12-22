import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import Image from "next/image";
import { Post } from "@/types/board";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <div className="relative h-48 w-full">
                <Image
                    src={post.thumbnailUrl || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-1 flex-wrap">
                        {post.categoryIds?.map((cat) => (
                            <Badge key={cat} variant="secondary" className="mb-2">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>
                <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.preview}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">{post.author}</span>
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
    );
}
