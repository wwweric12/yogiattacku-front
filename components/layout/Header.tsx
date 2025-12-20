"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/apis/auth/auth";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/login";

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            router.push("/login");
        }
    };

    if (isLoginPage) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">🌏 여기어때유</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Link href="/chat">
                        <Button variant="ghost" size="sm">
                            챗봇
                        </Button>
                    </Link>
                    <Link href="/board">
                        <Button variant="ghost" size="sm">
                            게시판
                        </Button>
                    </Link>
                    <Link href="/mypage">
                        <Button variant="ghost" size="sm">
                            마이페이지
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/01.png" alt="@user" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">사용자</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        user@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                로그아웃
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </div>
        </header>
    );
}
