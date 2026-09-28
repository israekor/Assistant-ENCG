import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({ onSend, loading }) {

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        onSend(message);

        setMessage("");
    };

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 sm:p-4">

            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto flex items-end gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1.5 pl-4 focus-within:ring-2 ring-brand-500/40 transition-shadow"
            >
                <input
                    type="text"
                    placeholder="Posez votre question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none py-2.5 text-[15px]"
                />

                <button
                    disabled={loading || !message.trim()}
                    className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-xl transition"
                >
                    <SendHorizontal size={18} />
                </button>
            </form>

        </div>
    );
}
