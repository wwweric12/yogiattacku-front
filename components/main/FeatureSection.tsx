"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureSection() {
    const features = [
        {
            title: "🧭 여행지 추천 챗봇",
            description: "OpenAI GPT를 활용하여 당신의 취향과 목적에 맞는 최적의 여행지를 추천해드립니다.",
            icon: "🤖"
        },
        {
            title: "📝 여행 블로그",
            description: "나만의 여행 기록을 남기고, 소중한 추억을 사진과 함께 저장하세요.",
            icon: "✍️"
        },
        {
            title: "📊 인기 여행지 랭킹",
            description: "다른 여행자들이 가장 많이 찾은 인기 여행지와 생생한 후기를 확인해보세요.",
            icon: "🏆"
        }
    ];

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            주요 기능
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            여기어때유가 제공하는 특별한 서비스를 경험해보세요
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-background">
                            <CardHeader>
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
