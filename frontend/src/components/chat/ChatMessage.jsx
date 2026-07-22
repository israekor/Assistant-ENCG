import { Bot, User } from "lucide-react";

export default function ChatMessage({ role, content }) {
    const isUser = role === "user";

    return (
        <div
            className={`flex gap-3 mb-6 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Bot size={20} className="text-white" />
                </div>
            )}

            <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-gray-100"
                }`}
            >
                <p className="font-semibold mb-2">
                    {isUser ? "Vous" : "Assistant IA"}
                </p>

                <p className="leading-7 whitespace-pre-wrap">
                    {content}
                </p>
            </div>

            {isUser && (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <User size={20} className="text-white" />
                </div>
            )}
        </div>
    );
}