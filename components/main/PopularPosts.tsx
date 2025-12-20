import { Post } from "@/types/board";
import { PostCard } from "@/components/board/PostCard";
import { fetchServer } from "@/apis/utils/server-api";
import Link from "next/link";

async function getPopularPosts(): Promise<Post[]> {
    try {
        return await fetchServer("/api/posts/popular");
    } catch (error) {
        console.error("Failed to fetch popular posts:", error);
        return [];
    }
}

export async function PopularPosts() {
    const posts = await getPopularPosts();

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
                        <Link key={post.id} href={`/board/${post.id}`}>
                            <PostCard post={post} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
