import { useState } from "react";

export default function ChatInput({ onSend, loading }) {

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        onSend(message);

        setMessage("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-700 p-4 flex gap-3"
        >
            <input
                type="text"
                placeholder="Posez votre question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-slate-700 text-white rounded-xl px-4 py-3 outline-none"
            />

            <button
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white px-6 rounded-xl transition"
            >
                {loading ? "Envoi..." : "Envoyer"}
            </button>
        </form>
    );
}