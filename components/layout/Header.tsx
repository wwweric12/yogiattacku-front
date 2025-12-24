"use client";

import Link from "next/link";
import Image from "next/image";
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
import { useQuery } from "@tanstack/react-query";

import { logout } from "@/apis/auth/auth";
import { getUser } from "@/apis/user";
import { userKeys } from "@/apis/utils/queryKeys";
import { BOARD_PAGE_SIZE } from "@/constants/board";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/login";

    const { data: user } = useQuery({
        queryKey: userKeys.profile(),
        queryFn: getUser,
        staleTime: Infinity, // Cache user profile for the session
        enabled: !isLoginPage, // Don't fetch on login page
    });

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
                        <Image
                            src="/logo_yogi.png"
                            alt="여기어때유 로고"
                            width={30}
                            height={30}
                            className="h-8 w-auto"
                            priority
                        />
                        <span className="text-xl font-bold">여기어때유</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Link href="/chat">
                        <Button variant={pathname.startsWith("/chat") ? "secondary" : "ghost"} size="sm">
                            챗봇
                        </Button>
                    </Link>
                    <Link href={`/board?page=1&pageSize=${BOARD_PAGE_SIZE}`}>
                        <Button
                            variant={pathname.startsWith("/board") && !pathname.startsWith("/board/mypage") ? "secondary" : "ghost"}
                            size="sm"
                        >
                            게시판
                        </Button>
                    </Link>
                    <Link href={`/board/mypage?page=1&pageSize=${BOARD_PAGE_SIZE}`}>
                        <Button
                            variant={pathname.startsWith("/board/mypage") ? "secondary" : "ghost"}
                            size="sm"
                        >
                            마이페이지
                        </Button>
                    </Link>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profileImageUrl || "/avatars/01.png"} alt={user.nickname} />
                                        <AvatarFallback>{user.nickname?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.nickname}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    로그아웃
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </nav>
            </div>
        </header>
    );
}
