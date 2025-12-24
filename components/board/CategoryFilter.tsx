"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { BOARD_CATEGORIES } from "@/constants/board";

export function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryIds = searchParams.get("categoryIds")?.split(",").map(Number).filter(id => !isNaN(id)) || [];

    const handleCategoryClick = useCallback((categoryId: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        let newCategoryIds = [...currentCategoryIds];
        if (newCategoryIds.includes(categoryId)) {
            newCategoryIds = newCategoryIds.filter(id => id !== categoryId);
        } else {
            newCategoryIds.push(categoryId);
        }

        if (newCategoryIds.length > 0) {
            newSearchParams.set("categoryIds", newCategoryIds.join(","));
        } else {
            newSearchParams.delete("categoryIds");
        }

        newSearchParams.set("page", "1");

        router.push(`?${newSearchParams.toString()}`);
    }, [currentCategoryIds, router, searchParams]);

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {BOARD_CATEGORIES.map((category) => (
                <Button
                    key={category.id}
                    variant="outline"
                    onClick={() => handleCategoryClick(category.id)}
                    className={cn(
                        "rounded-full transition-all",
                        currentCategoryIds.includes(category.id)
                            ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                            : "hover:bg-gray-100"
                    )}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}
