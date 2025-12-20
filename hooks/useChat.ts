import { useState, useRef, useCallback } from "react";
import { Message, Spot } from "@/types/chat";
import { streamChatResponse } from "@/apis/chat";

interface UseChatProps {
    onSpotsReceived: (spots: Spot[]) => void;
}

export function useChat({ onSpotsReceived }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    }, []);

    const handleSend = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        try {
            for await (const data of streamChatResponse(userMessage.content, controller.signal)) {
                if (data.type === "DESCRIPTION") {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: msg.content + (data.descriptionChunk || "") }
                                : msg
                        )
                    );
                } else if (data.type === "SPOTS") {
                    if (data.spots) {
                        onSpotsReceived(data.spots);
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, spots: data.spots || [] }
                                    : msg
                            )
                        );
                    }
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log("Chat generation stopped by user");
            } else {
                console.error("Chat Error:", error);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: "죄송합니다. 오류가 발생했습니다." }
                            : msg
                    )
                );
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [input, isLoading, onSpotsReceived]);

    return {
        messages,
        input,
        setInput,
        isLoading,
        handleSend,
        handleStop
    };
}
