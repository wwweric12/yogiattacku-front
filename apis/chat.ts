import { ChatResponse } from "@/types/chat";
import { BASE_URL } from "./utils/constants";

export async function* streamChatResponse(query: string, signal?: AbortSignal): AsyncGenerator<ChatResponse, void, unknown> {
    const response = await fetch(`${BASE_URL}/recommend/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ query }),
        signal,
    });

    if (!response.ok || !response.body) {
        throw new Error(`Chat API Error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("event:")) continue;

                const eventMatch = trimmed.match(/event:(.*)\n/);
                const dataMatch = trimmed.match(/data:(.*)/);

                if (eventMatch && dataMatch) {
                    const eventType = eventMatch[1].trim();
                    const dataStr = dataMatch[1].trim();

                    if (eventType === "done") return; // End of stream

                    try {
                        const data: ChatResponse = JSON.parse(dataStr);
                        yield data;
                    } catch (e) {
                        console.error("JSON Parse Error:", e);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
