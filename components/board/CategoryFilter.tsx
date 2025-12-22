"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { BOARD_CATEGORIES } from "@/constants/board";

export function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];

    const handleCategoryClick = useCallback((category: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        let newCategories = [...currentCategories];
        if (newCategories.includes(category)) {
            newCategories = newCategories.filter(c => c !== category);
        } else {
            newCategories.push(category);
        }

        if (newCategories.length > 0) {
            newSearchParams.set("categories", newCategories.join(","));
        } else {
            newSearchParams.delete("categories");
        }

        newSearchParams.set("page", "0");

        router.push(`?${newSearchParams.toString()}`);
    }, [currentCategories, router, searchParams]);

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {BOARD_CATEGORIES.map((category) => (
                <Button
                    key={category}
                    variant="outline"
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                        "rounded-full transition-all",
                        currentCategories.includes(category)
                            ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                            : "hover:bg-gray-100"
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
