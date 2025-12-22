"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    hasNext: boolean;
}

export function Pagination({ currentPage, hasNext }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", newPage.toString());
        router.push(`?${newSearchParams.toString()}`);
    };

    if (currentPage === 0 && !hasNext) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
            </Button>

            <span className="text-sm font-medium mx-2">
                {currentPage + 1}
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
            >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );
}
