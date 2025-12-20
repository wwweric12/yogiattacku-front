"use client";

import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { Spot } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatInterfaceProps {
    onSpotsReceived: (spots: Spot[]) => void;
}

export default function ChatInterface({ onSpotsReceived }: ChatInterfaceProps) {
    const { messages, input, setInput, isLoading, handleSend, handleStop } = useChat({ onSpotsReceived });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <Bot className="w-6 h-6 text-blue-500" />
                <h2 className="font-semibold text-gray-800">여행 AI 가이드</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>여행지에 대해 물어보세요!</p>
                        <p className="text-sm">ex) 부산 맛집 추천해줘</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLast={index === messages.length - 1}
                        isLoading={isLoading}
                        onSpotClick={onSpotsReceived}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSend={handleSend}
                onStop={handleStop}
            />
        </div>
    );
}
