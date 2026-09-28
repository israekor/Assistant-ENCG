import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FeedbackButtons from "./FeedbackButtons";

export default function ChatMessage({
    role,
    content,
    responseId,
    feedback,
    onFeedback,
    isStreaming = false
}) {

    const isUser = role === "user";

    return (
        <div
            className={`flex gap-3 mb-6 items-start animate-fade-in ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={18} className="text-white" />
                </div>
            )}

            <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm ${
                    isUser
                        ? "bg-brand-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-tl-sm"
                }`}
            >
                {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap text-[15px]">
                        {content}
                    </p>
                ) : (
                    <div className="leading-relaxed text-[15px] markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="inline-block w-2 ml-0.5 animate-pulse">▊</span>
                        )}
                    </div>
                )}

                {!isUser && responseId && !isStreaming && (
                    <FeedbackButtons
                        responseId={responseId}
                        feedback={feedback}
                        onFeedback={onFeedback}
                    />
                )}
            </div>

            {isUser && (
                <div className="w-9 h-9 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={18} className="text-white" />
                </div>
            )}
        </div>
    );
}