"use client";

import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">🌏 여기어때유</h1>
                    <p className="text-muted-foreground text-lg">
                        AI 기반 맞춤형 여행지 추천 서비스
                    </p>
                </div>

                <div className="flex justify-center">
                    <KakaoLoginButton />
                </div>
            </div>
        </div>
    );
}
