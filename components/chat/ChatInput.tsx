import { Send } from "lucide-react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    onSend: (e?: React.FormEvent) => void;
    onStop: () => void;
}

export function ChatInput({ input, setInput, isLoading, onSend, onStop }: ChatInputProps) {
    return (
        <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={onSend} className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    disabled={isLoading}
                />
                {isLoading ? (
                    <button
                        type="button"
                        onClick={onStop}
                        className="absolute right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <div className="w-4 h-4 bg-white rounded-sm" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                )}
            </form>
        </div>
    );
}
