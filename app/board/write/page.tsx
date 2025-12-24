"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BOARD_CATEGORIES } from "@/constants/board";
import { createPost, getBucketRootKey } from "@/apis/board";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/apis/utils/queryKeys";


const Editor = dynamic(() => import("@/components/board/Editor"), {
    ssr: false,
    loading: () => <div className="h-[500px] border rounded-md flex items-center justify-center bg-gray-50">Loading Editor...</div>
});

export default function WritePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [bucketRootKey, setBucketRootKey] = useState<string>("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [s3Keys, setS3Keys] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBucketKey = async () => {
            try {
                const data = await getBucketRootKey();
                setBucketRootKey(data.bucketRootKey);
            } catch (error) {
                console.error("Failed to fetch bucket root key:", error);
            }
        };
        fetchBucketKey();
    }, []);

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleImageUpload = (s3Key: string) => {
        setS3Keys(prev => [...prev, s3Key]);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || selectedCategories.length === 0 || !bucketRootKey) {
            alert("제목, 내용, 카테고리를 모두 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await createPost({
                bucketRootKey,
                title,
                content,
                categoryIds: selectedCategories,
                s3Keys,
            });
            await queryClient.invalidateQueries({ queryKey: boardKeys.all });
            router.push("/board");
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("게시글 작성에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">여행기 작성</h1>

            <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                        id="title"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg"
                    />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <Label>카테고리 (최소 1개 선택)</Label>
                    <div className="flex flex-wrap gap-2">
                        {BOARD_CATEGORIES.map((category) => (
                            <Button
                                key={category.id}
                                type="button"
                                variant="outline"
                                onClick={() => handleCategoryToggle(category.id)}
                                className={cn(
                                    "rounded-full transition-all",
                                    selectedCategories.includes(category.id)
                                        ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="space-y-2">
                    <Label>내용</Label>
                    <Editor
                        markdown={content}
                        onChange={setContent}
                        bucketRootKey={bucketRootKey}
                        onImageUpload={handleImageUpload}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !bucketRootKey}
                    >
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
