import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ServiceHero() {
    return (
        <section className="w-full py-12 md:py-20 lg:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            여행지 추천부터 후기 공유까지,<br />
                            <span className="text-primary">여기어때유</span>와 함께하세요
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            AI 챗봇이 당신의 취향에 딱 맞는 여행지를 찾아드립니다.
                            다녀온 여행의 추억을 기록하고 다른 여행자들과 공유해보세요.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link href="/chat">
                            <Button size="lg" className="px-8">
                                AI 여행 추천받기
                            </Button>
                        </Link>
                        <Link href="/board">
                            <Button variant="outline" size="lg" className="px-8">
                                여행 후기 보기
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
