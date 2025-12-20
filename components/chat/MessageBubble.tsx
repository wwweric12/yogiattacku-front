import { Bot, User, MapPin } from "lucide-react";
import { Message, Spot } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    message: Message;
    isLast: boolean;
    isLoading: boolean;
    onSpotClick: (spots: Spot[]) => void;
}

export function MessageBubble({ message, isLast, isLoading, onSpotClick }: MessageBubbleProps) {
    const isUser = message.role === "user";
    const showLoadingDots = isLoading && isLast && message.role === "assistant" && !message.content;

    return (
        <div
            className={cn(
                "flex gap-3 max-w-[85%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
        >
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isUser ? "bg-blue-500" : "bg-emerald-500"
                )}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>
            <div
                className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                )}
            >
                <div className="whitespace-pre-wrap">{message.content}</div>

                {showLoadingDots && (
                    <div className="mt-2 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}

                {message.spots && message.spots.length > 0 && (
                    <div className="mt-3 grid gap-2">
                        {message.spots.map(spot => (
                            <button
                                key={spot.id}
                                className="flex items-center gap-2 text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded border border-gray-200 transition-colors text-left"
                                onClick={() => onSpotClick([spot])}
                            >
                                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span>{spot.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function LoadingBubble() {
    return (
        <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}
