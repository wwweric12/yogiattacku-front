"use client"
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    if (pathname === "/login") return null;

    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2025 여기어때유. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
