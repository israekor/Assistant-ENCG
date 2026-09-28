import { Bot } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex gap-3 mb-6 items-start animate-fade-in">

            <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={18} className="text-white" />
            </div>

            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">

                <div className="flex gap-1.5">

                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>

                    <span
                        className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                    ></span>

                    <span
                        className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                    ></span>

                </div>

            </div>

        </div>
    );
}
